import { spring, interpolate } from "remotion";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AnimatedText } from "./OFlock/AnimatedText";
import { FeatureCard } from "./OFlock/FeatureCard";
import { COLORS, FONT_FAMILY } from "./OFlock/constants";

export const oflockSchema = z.object({
  title: z.string(),
  tagline: z.string(),
});

export const OFlockPromo: React.FC<z.infer<typeof oflockSchema>> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fade out at the end
  const opacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 10],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Background gradient animation
  const gradientProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const gradientRotation = interpolate(gradientProgress, [0, 1], [0, 15]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: "hidden",
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `linear-gradient(${gradientRotation}deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(15, 23, 42, 0) 50%,
            rgba(139, 92, 246, 0.1) 100%)`,
          transform: `rotate(${gradientRotation}deg)`,
        }}
      />

      <AbsoluteFill style={{ opacity }}>
        {/* Scene 1: Logo and Tagline */}
        <Sequence from={0} durationInFrames={90}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 30,
            }}
          >
            <AnimatedText
              text={title}
              color={COLORS.text}
              fontSize={140}
              fontWeight="500"
            />
            <Sequence from={20}>
              <AnimatedText
                text={tagline}
                color={COLORS.muted}
                fontSize={42}
                fontWeight="400"
              />
            </Sequence>
          </AbsoluteFill>
        </Sequence>

        {/* Scene 2: Features */}
        <Sequence from={90} durationInFrames={120}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 60,
            }}
          >
            <AnimatedText
              text="Your Daily Clarity System"
              color={COLORS.text}
              fontSize={64}
            />
            <div
              style={{
                display: "flex",
                gap: 30,
                marginTop: 20,
              }}
            >
              <Sequence from={15}>
                <FeatureCard
                  title="Reflect"
                  description="Start each day with intention and mental clarity"
                  index={0}
                  icon="🧘"
                />
              </Sequence>
              <Sequence from={15}>
                <FeatureCard
                  title="Focus"
                  description="Define your mission and eliminate distractions"
                  index={1}
                  icon="🎯"
                />
              </Sequence>
              <Sequence from={15}>
                <FeatureCard
                  title="Execute"
                  description="Turn clarity into action with guided tasks"
                  index={2}
                  icon="⚡"
                />
              </Sequence>
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Scene 3: Call to Action */}
        <Sequence from={210} durationInFrames={90}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 40,
            }}
          >
            <AnimatedText
              text="Silence the noise."
              color={COLORS.text}
              fontSize={80}
            />
            <Sequence from={25}>
              <AnimatedText
                text="Execute the signal."
                color={COLORS.accent}
                fontSize={80}
              />
            </Sequence>
            <Sequence from={50}>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 32,
                  color: COLORS.muted,
                  marginTop: 40,
                }}
              >
                Start your journey today
              </div>
            </Sequence>
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
