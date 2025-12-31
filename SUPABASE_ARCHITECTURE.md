# O'Flock Supabase Architecture

This document outlines the production-read backend architecture for O'Flock, designed to support authentication, user history, freemium limits, payments, and scalability.

## 1. Authentication & User Management

**Provider**: Google Auth (via Supabase Auth)
**Behavior**: 
- Users can interact as guests (no DB storage required initially).
- "Log in to Save" or "Log in to Upgrade" triggers auth flow.
- On sign-up, a trigger automatically creates a entry in `public.profiles`.

### Schema: `public.profiles`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key, references `auth.users.id`. |
| `email` | text | User's email address. |
| `created_at` | timestamptz | Account creation timestamp. |

## 2. Missions & History

Stores the core value: business ideas and execution blueprints.

### Schema: `public.missions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Unique ID for the mission. |
| `user_id` | uuid | Owner of the mission. Verified via RLS. |
| `title` | text | Name of the business idea. |
| `blueprint` | jsonb | Full execution plan (action plan, marketing, etc). |

**RLS Policy**: Users can only `SELECT`, `INSERT`, `UPDATE`, `DELETE` rows where `user_id = auth.uid()`.

## 3. Freemium Usage Limits

Enforces the "5 ideas per month" limit for free users.

### Schema: `public.usage_limits`
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | uuid | The user. |
| `ideas_generated_count` | int | Count of ideas generated in current period. |
| `last_reset_date` | timestamptz | When the count was last reset. |

**Logic**:
1. Before generation, client/edge function calls `can_generate_mission(user_id)`.
   - Checks if `last_reset_date` is > 1 month ago. If so, allows generation (lazy reset).
   - If within month, checks if `ideas_generated_count < 5`.
2. If `true`, proceed.
3. After generation, call `increment_usage(user_id)`.
    - Automatically resets count and date if older than 1 month.
    - Otherwise increments count.

## 4. Subscriptions & Payments

Handles access to "Unlimited" features.

### Schema: `public.subscriptions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | uuid | The user. |
| `status` | enum | `active`, `canceled`, `expired`, etc. |
| `plan` | enum | `monthly` or `lifetime`. |
| `expires_at` | timestamptz | NULL for lifetime, date for monthly. |

## 5. Cost Management (AI Usage)

Tracks token consumption for business analytics and potential future rate limiting.

### Schema: `public.ai_usage`
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | uuid | The user. |
| `tokens_used` | int | Number of tokens consumed in request. |
| `model_name` | text | e.g., "gemini-1.5-pro". |

## API Usage Examples

### Saving a Mission
```typescript
const { data, error } = await supabase
  .from('missions')
  .insert([
    { 
      user_id: user.id, 
      title: 'My AI SaaS', 
      blueprint: generatedBlueprint 
    }
  ]);
```

### Fetching History
```typescript
const { data, error } = await supabase
  .from('missions')
  .select('*')
  .order('created_at', { ascending: false });
```

### Checking Limits
```typescript
const { data, error } = await supabase
  .rpc('can_generate_mission', { check_user_id: user.id });

if (!data) {
  // Show Pricing Modal
}
```

## Setup Instructions

1.  **Run Migration**: Execute the SQL in `supabase_schema.sql` in the Supabase SQL Editor.
2.  **Enable Auth**: Go to Authentication -> Providers -> enable Google.
3.  **Env Variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your frontend `.env`.
