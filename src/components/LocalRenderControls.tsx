import { z } from "zod";
import { useLocalRendering } from "../helpers/use-local-rendering";
import { CompositionProps } from "../types/constants";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button/Button";
import { InputContainer } from "./Container";
import { LocalDownloadButton } from "./LocalDownloadButton";
import { ErrorComp } from "./Error";
import { Input } from "./Input";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";

export const LocalRenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputProps: z.infer<typeof CompositionProps>;
}> = ({ text, setText, inputProps }) => {
  const { renderMedia, state, undo } = useLocalRendering(inputProps);

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "rendering" ||
      state.status === "error" ? (
        <>
          <Input
            disabled={state.status === "rendering"}
            setText={setText}
            text={text}
          ></Input>
          <Spacing></Spacing>
          <AlignEnd>
            <Button
              disabled={state.status === "rendering"}
              loading={state.status === "rendering"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing></Spacing>
          <AlignEnd>
            <LocalDownloadButton undo={undo} state={state}></LocalDownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
}; 