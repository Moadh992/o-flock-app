import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONT_FAMILY, COLORS } from "./constants";

export const FeatureCard: React.FC<{
  readonly title: string;
  readonly description: string;
  readonly index: number;
  readonly icon: string;
}> = ({ title, description, index, icon }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const delay = index * 10;

  const slideIn = spring({
    fps,
    frame: frame - delay,
    config: {
      damping: 100,
      stiffness: 100,
    },
  });

  const translateY = interpolate(slideIn, [0, 1], [100, 0]);
  const opacity = interpolate(slideIn, [0, 1], [0, 1]);

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 24,
        padding: 40,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transform: `translateY(${translateY}px)`,
        opacity,
        width: 350,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 20,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 28,
          fontWeight: "600",
          color: COLORS.text,
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 18,
          color: COLORS.muted,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
};
