import { z } from "zod";
import { useRendering } from "../helpers/use-rendering";
import { CompositionProps, COMP_NAME } from "../types/constants";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button/Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { Input } from "./Input";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";
import React from "react";

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--foreground)",
};

export const RenderControls: React.FC<{
  inputProps: z.infer<typeof CompositionProps>;
  setInputProps: React.Dispatch<React.SetStateAction<z.infer<typeof CompositionProps>>>;
}> = ({ inputProps, setInputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  const updateName: React.Dispatch<React.SetStateAction<string>> = (value) => {
    const newValue = typeof value === 'function' ? value(inputProps.name) : value;
    setInputProps(prev => ({ ...prev, name: newValue }));
  };

  const updatePosition: React.Dispatch<React.SetStateAction<string>> = (value) => {
    const newValue = typeof value === 'function' ? value(inputProps.position) : value;
    setInputProps(prev => ({ ...prev, position: newValue }));
  };

  const updateDepartment: React.Dispatch<React.SetStateAction<string>> = (value) => {
    const newValue = typeof value === 'function' ? value(inputProps.department) : value;
    setInputProps(prev => ({ ...prev, department: newValue }));
  };

  const updateEmployeeId: React.Dispatch<React.SetStateAction<string>> = (value) => {
    const newValue = typeof value === 'function' ? value(inputProps.employeeId) : value;
    setInputProps(prev => ({ ...prev, employeeId: newValue }));
  };

  const updatePhotoUrl: React.Dispatch<React.SetStateAction<string>> = (value) => {
    const newValue = typeof value === 'function' ? value(inputProps.photoUrl || '') : value;
    setInputProps(prev => ({ ...prev, photoUrl: newValue }));
  };

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          <div>
            <label style={labelStyle}>Nombre completo</label>
            <Input
              disabled={state.status === "invoking"}
              setText={updateName}
              text={inputProps.name}
            />
          </div>
          <Spacing />
          <div>
            <label style={labelStyle}>Cargo/Posición</label>
            <Input
              disabled={state.status === "invoking"}
              setText={updatePosition}
              text={inputProps.position}
            />
          </div>
          <Spacing />
          <div>
            <label style={labelStyle}>Departamento</label>
            <Input
              disabled={state.status === "invoking"}
              setText={updateDepartment}
              text={inputProps.department}
            />
          </div>
          <Spacing />
          <div>
            <label style={labelStyle}>ID de empleado</label>
            <Input
              disabled={state.status === "invoking"}
              setText={updateEmployeeId}
              text={inputProps.employeeId}
            />
          </div>
          <Spacing />
          <div>
            <label style={labelStyle}>URL de la foto (opcional)</label>
            <Input
              disabled={state.status === "invoking"}
              setText={updatePhotoUrl}
              text={inputProps.photoUrl || ''}
            />
          </div>
          <Spacing />
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render tarjeta
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
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
