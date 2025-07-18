import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

interface IDCardProps {
  name: string;
  position: string;
  department: string;
  employeeId: string;
  photoUrl?: string;
  progress: number;
}

export const IDCard: React.FC<IDCardProps> = ({
  name,
  position,
  department,
  employeeId,
  photoUrl,
  progress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    fps,
    frame,
    config: { damping: 100, stiffness: 200 },
    durationInFrames: 40,
  });

  const photoProgress = spring({
    fps,
    frame: frame - 20,
    config: { damping: 100, stiffness: 200 },
    durationInFrames: 30,
  });

  const textProgress = spring({
    fps,
    frame: frame - 40,
    config: { damping: 100, stiffness: 200 },
    durationInFrames: 50,
  });

  // Estilos de la tarjeta
  const cardContainer: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
    perspective: "1000px",
  };

  const cardStyle: React.CSSProperties = {
    width: 400,
    height: 250,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    position: "relative",
    overflow: "hidden",
    transform: `
      translateY(${interpolate(cardProgress, [0, 1], [50, 0])}px)
      rotateX(${interpolate(cardProgress, [0, 1], [15, 0])}deg)
      scale(${interpolate(cardProgress, [0, 1], [0.8, 1])})
    `,
    opacity: interpolate(cardProgress, [0, 1], [0, 1]),
  };

  const headerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  };

  const companyName: React.CSSProperties = {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily,
  };

  const contentStyle: React.CSSProperties = {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    display: "flex",
    gap: 20,
  };

  const photoContainer: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    border: "3px solid #e2e8f0",
    transform: `scale(${interpolate(photoProgress, [0, 1], [0, 1])})`,
    opacity: interpolate(photoProgress, [0, 1], [0, 1]),
  };

  const photoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const infoContainer: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transform: `translateX(${interpolate(textProgress, [0, 1], [30, 0])}px)`,
    opacity: interpolate(textProgress, [0, 1], [0, 1]),
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    fontFamily,
    marginBottom: 4,
  };

  const positionStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: "500",
    color: "#475569",
    fontFamily,
    marginBottom: 2,
  };

  const departmentStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: "400",
    color: "#64748b",
    fontFamily,
    marginBottom: 16,
  };

  const idStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    fontFamily,
    backgroundColor: "#f8fafc",
    padding: "4px 8px",
    borderRadius: 6,
    alignSelf: "flex-start",
  };

  const decorativeElement: React.CSSProperties = {
    position: "absolute",
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: "50%",
    transform: `scale(${interpolate(cardProgress, [0, 1], [0, 1])})`,
  };

  return (
    <AbsoluteFill style={cardContainer}>
      <div style={cardStyle}>
        <div style={decorativeElement} />

        <div style={headerStyle}>
          <div style={companyName}>Indio </div>
        </div>

        <div style={contentStyle}>
          <div style={photoContainer}>
            {photoUrl ? (
              <Img src={photoUrl} style={photoStyle} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#94a3b8",
                }}
              >
                👤
              </div>
            )}
          </div>

          <div style={infoContainer}>
            <div>
              <div style={nameStyle}>{name}</div>
              <div style={positionStyle}>{position}</div>
              <div style={departmentStyle}>{department}</div>
            </div>
            <div style={idStyle}>ID: {employeeId}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
