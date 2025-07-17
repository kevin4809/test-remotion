import { z } from "zod";
import { useCallback, useMemo, useState } from "react";
import { CompositionProps } from "../types/constants";

export type LocalState =
  | {
      status: "init";
    }
  | {
      status: "rendering";
      progress: number;
    }
  | {
      status: "error";
      error: Error;
    }
  | {
      status: "done";
      url: string;
      size: number;
    };

export const useLocalRendering = (
  inputProps: z.infer<typeof CompositionProps>,
) => {
  const [state, setState] = useState<LocalState>({
    status: "init",
  });

  const renderMedia = useCallback(async () => {
    setState({
      status: "rendering",
      progress: 0,
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState((prev) => {
          if (prev.status === "rendering" && prev.progress < 0.9) {
            return {
              ...prev,
              progress: prev.progress + 0.1,
            };
          }
          return prev;
        });
      }, 500);

      // Call our local API
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputProps),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to render video");
      }

      // Create a blob URL for the video
      const videoBlob = await response.blob();
      const url = URL.createObjectURL(videoBlob);

      setState({
        status: "done",
        url,
        size: videoBlob.size,
      });

    } catch (err) {
      setState({
        status: "error",
        error: err as Error,
      });
    }
  }, [inputProps]);

  const undo = useCallback(() => {
    // Clean up blob URL if it exists
    if (state.status === "done") {
      URL.revokeObjectURL(state.url);
    }
    setState({ status: "init" });
  }, [state]);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
    };
  }, [renderMedia, state, undo]);
}; 