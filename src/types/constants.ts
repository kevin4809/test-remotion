import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  name: z.string(),
  position: z.string(),
  department: z.string(),
  employeeId: z.string(),
  photoUrl: z.string().optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  name: "Kevin",
  position: "Un desarrollador muy feliz ",
  department: "Tenologiaaaa",
  employeeId: "No c que colocar k funcione por favo",
  photoUrl: "",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
