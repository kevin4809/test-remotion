import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React, { useMemo } from "react";
import { IDCard } from "./IDCard";
import { CompositionProps } from "../../types/constants";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

const container: React.CSSProperties = {
  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
};

export const Main = ({ name, position, department, employeeId, photoUrl }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación principal de entrada
  const mainProgress = spring({
    fps,
    frame,
    config: {
      damping: 200,
      stiffness: 100,
    },
    durationInFrames: 60,
  });

  return (
    <AbsoluteFill style={container}>
      <Sequence from={0}>
        <IDCard
          name={name}
          position={position}
          department={department}
          employeeId={employeeId}
          photoUrl={photoUrl}
          progress={mainProgress}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
