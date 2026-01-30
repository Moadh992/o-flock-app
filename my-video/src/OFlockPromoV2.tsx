import { spring, interpolate, Easing } from "remotion";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { z } from "zod";

// Schema for the video
export const oflockPromoV2Schema = z.object({
  title: z.string(),
  tagline: z.string(),
});

// Color palette
const COLORS = {
  white: "#FFFFFF",
  background: "#F7F7F5",
  slate: "#0f172a",
  yellow: "#FBBF24",
  pink: "#EC4899",
  blue: "#3B82F6",
  orange: "#F97316",
  muted: "#64748b",
};

const FONT_SANS = "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, sans-serif";
const FONT_MONO = "SF Mono, Consolas, Monaco, 'Courier New', monospace";

// Character-by-character text reveal component
const CharacterReveal: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  delay?: number;
  charDelay?: number;
}> = ({
  text,
  fontSize = 48,
  color = COLORS.slate,
  fontFamily = FONT_MONO,
  fontWeight = "400",
  delay = 0,
  charDelay = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {text.split("").map((char, i) => {
        const charFrame = delay + i * charDelay;
        const opacity = interpolate(
          frame,
          [charFrame, charFrame + 3],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const translateY = interpolate(
          frame,
          [charFrame, charFrame + 5],
          [20, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              display: "inline-block",
              whiteSpace: "pre",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// Countdown number component with color transition
const CountdownNumber: React.FC<{
  number: number;
  colors: string[];
}> = ({ number, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const opacity = interpolate(frame, [0, 5, 20, 25], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Color transition left to right
  const colorProgress = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gradientPosition = colorProgress * 100;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(90deg,
          ${colors[0]} ${gradientPosition - 50}%,
          ${colors[1]} ${gradientPosition}%,
          ${colors[2]} ${gradientPosition + 50}%)`,
        transition: "background 0.1s ease",
      }}
    >
      <span
        style={{
          fontFamily: FONT_SANS,
          fontSize: 400,
          fontWeight: "200",
          color: COLORS.slate,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {number}
      </span>
    </AbsoluteFill>
  );
};

// Animated line component (vertical)
const AnimatedLine: React.FC<{
  delay?: number;
  height?: number;
  color?: string;
}> = ({ delay = 0, height = 100, color = COLORS.slate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const lineHeight = interpolate(progress, [0, 1], [0, height]);

  return (
    <div
      style={{
        width: 2,
        height: lineHeight,
        backgroundColor: color,
        marginTop: 20,
      }}
    />
  );
};

// Feature item with animation
const FeatureItem: React.FC<{
  text: string;
  delay?: number;
  icon?: string;
}> = ({ text, delay = 0, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity,
        transform: `translateX(${translateX}px)`,
        fontFamily: FONT_SANS,
        fontSize: 32,
        color: COLORS.slate,
      }}
    >
      {icon && <span style={{ fontSize: 28 }}>{icon}</span>}
      <span>{text}</span>
    </div>
  );
};

// Main Promo Component
export const OFlockPromoV2: React.FC<z.infer<typeof oflockPromoV2Schema>> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Scene timings (in frames at 30fps)
  const COUNTDOWN_START = 0;
  const COUNTDOWN_DURATION = 90; // 3 seconds
  const INTRO_START = 90;
  const INTRO_DURATION = 60; // 2 seconds
  const PROBLEM_START = 150;
  const PROBLEM_DURATION = 120; // 4 seconds
  const LOGO_START = 270;
  const LOGO_DURATION = 90; // 3 seconds
  const FEATURES_START = 360;
  const FEATURES_DURATION = 150; // 5 seconds
  const FINAL_START = 510;
  const FINAL_DURATION = 150; // 5 seconds

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* SCENE 1: Countdown 3 → 2 → 1 */}
      <Sequence from={COUNTDOWN_START} durationInFrames={30}>
        <CountdownNumber
          number={3}
          colors={[COLORS.white, COLORS.yellow, COLORS.pink]}
        />
      </Sequence>
      <Sequence from={30} durationInFrames={30}>
        <CountdownNumber
          number={2}
          colors={[COLORS.yellow, COLORS.pink, COLORS.blue]}
        />
      </Sequence>
      <Sequence from={60} durationInFrames={30}>
        <CountdownNumber
          number={1}
          colors={[COLORS.pink, COLORS.blue, COLORS.orange]}
        />
      </Sequence>

      {/* SCENE 2: Introduction */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION}>
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CharacterReveal
            text="Introducing"
            fontSize={72}
            fontFamily={FONT_MONO}
            color={COLORS.slate}
            delay={5}
            charDelay={3}
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3: The Problem */}
      <Sequence from={PROBLEM_START} durationInFrames={PROBLEM_DURATION}>
        <ProblemScene />
      </Sequence>

      {/* SCENE 4: Logo Reveal */}
      <Sequence from={LOGO_START} durationInFrames={LOGO_DURATION}>
        <LogoRevealScene title={title} tagline={tagline} />
      </Sequence>

      {/* SCENE 5: Feature Showcase */}
      <Sequence from={FEATURES_START} durationInFrames={FEATURES_DURATION}>
        <FeatureShowcase />
      </Sequence>

      {/* FINAL: Call to Action */}
      <Sequence from={FINAL_START} durationInFrames={FINAL_DURATION}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene 3: The Problem
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity1 = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity2 = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
        padding: 100,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 56,
          fontWeight: "500",
          color: COLORS.slate,
          textAlign: "center",
          opacity: textOpacity1,
          maxWidth: 1200,
          lineHeight: 1.3,
        }}
      >
        Most founders fail because they
        <br />
        <span style={{ color: COLORS.orange }}>build the wrong thing</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: textOpacity2,
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 120,
            fontWeight: "700",
            color: COLORS.pink,
            transform: `scale(${statScale})`,
          }}
        >
          90%
        </span>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 36,
            color: COLORS.muted,
          }}
        >
          of startups fail
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Logo Reveal
const LogoRevealScene: React.FC<{ title: string; tagline: string }> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const lineProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const lineHeight = interpolate(lineProgress, [0, 1], [0, 80]);

  const taglineOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 160,
            fontWeight: "600",
            color: COLORS.slate,
            letterSpacing: "-0.02em",
          }}
        >
          O'Flock
        </span>

        {/* Animated vertical line */}
        <div
          style={{
            width: 2,
            height: lineHeight,
            backgroundColor: COLORS.slate,
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 32,
            fontWeight: "400",
            color: COLORS.muted,
            opacity: taglineOpacity,
            letterSpacing: "0.05em",
          }}
        >
          Your Psychological AI Co-Founder
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Feature Showcase
const FeatureShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dark/light mode toggle animation
  const toggleProgress = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isDark = toggleProgress > 0.5;
  const bgColor = isDark ? COLORS.slate : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.slate;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 50,
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 48,
          fontWeight: "600",
          color: textColor,
          marginBottom: 20,
          transition: "color 0.3s ease",
        }}
      >
        Built for Founders
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          maxWidth: 1000,
        }}
      >
        <FeatureItem text="8 Deep Sections" delay={10} icon="📊" />
        <FeatureItem text="30+ Reflective Questions" delay={20} icon="💭" />
        <FeatureItem text="Gemini AI Integration" delay={30} icon="🤖" />
        <FeatureItem text="Dark/Light Mode" delay={40} icon="🌓" />
        <FeatureItem text="Export to PDF" delay={50} icon="📄" />
        <FeatureItem text="Save Progress" delay={60} icon="💾" />
      </div>

      {/* Mode toggle indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ color: textColor, fontFamily: FONT_SANS, fontSize: 20 }}>
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
        <div
          style={{
            width: 60,
            height: 30,
            borderRadius: 15,
            backgroundColor: isDark ? COLORS.blue : "#e2e8f0",
            position: "relative",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: COLORS.white,
              position: "absolute",
              top: 3,
              left: isDark ? 33 : 3,
              transition: "left 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Final Scene
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background color animation (left-to-right and right-to-left)
  const colorShift = interpolate(frame, [0, 150], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(frame, [60, 150], [1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const textOpacity1 = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity2 = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${colorShift}deg,
          ${COLORS.white} 0%,
          rgba(251, 191, 36, 0.1) 25%,
          rgba(236, 72, 153, 0.1) 50%,
          rgba(59, 130, 246, 0.1) 75%,
          ${COLORS.white} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 52,
            fontWeight: "500",
            color: COLORS.slate,
            textAlign: "center",
            opacity: textOpacity1,
            lineHeight: 1.4,
          }}
        >
          Stop building random ideas.
        </div>

        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 64,
            fontWeight: "700",
            color: COLORS.blue,
            textAlign: "center",
            opacity: textOpacity2,
          }}
        >
          Build YOUR mission.
        </div>

        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: ctaOpacity,
          }}
        >
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 100,
              fontWeight: "600",
              color: COLORS.slate,
            }}
          >
            O'Flock
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 30,
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.slate,
                color: COLORS.white,
                fontFamily: FONT_SANS,
                fontSize: 28,
                fontWeight: "500",
                padding: "16px 40px",
                borderRadius: 50,
              }}
            >
              Start Free →
            </div>
          </div>

          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 24,
              color: COLORS.muted,
              marginTop: 20,
            }}
          >
            o-flock.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
