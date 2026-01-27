import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "./constants";

export const AnimatedText: React.FC<{
  readonly text: string;
  readonly color: string;
  readonly fontSize?: number;
  readonly delay?: number;
  readonly fontWeight?: string;
}> = ({ text, color, fontSize = 80, delay = 0, fontWeight = "bold" }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const words = text.split(" ");

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight,
        fontSize,
        textAlign: "center",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * 5;

        const scale = spring({
          fps,
          frame: frame - wordDelay,
          config: {
            damping: 200,
          },
        });

        const opacity = spring({
          fps,
          frame: frame - wordDelay,
          config: {
            damping: 100,
          },
        });

        return (
          <span
            key={`${word}-${i}`}
            style={{
              color,
              transform: `scale(${scale})`,
              opacity,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
