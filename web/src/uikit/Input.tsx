import styled from "styled-components";
import { SmallText, Text } from "./typographic";
import { colors } from "./theme";

type TextareaProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

type HereInputProps =
  | (TextareaProps & {
      multiline: true;
      label?: string;
      postfix?: void;
      postfixStyle?: void;
      hasError?: boolean;
      backgroundColor?: string;
      style?: any;
    })
  | (InputProps & {
      label?: string;
      multiline?: false;
      postfix?: string;
      postfixStyle?: any;
      hasError?: boolean;
      backgroundColor?: string;
      style?: any;
    });

const HereInput = ({ multiline, postfix = "", postfixStyle, label, hasError, backgroundColor, style, ...props }: HereInputProps) => {
  const usePostfix = !multiline && !!postfix;

  return (
    <InputWrap
      className={props.value || usePostfix ? "editted" : ""}
      style={{ background: backgroundColor, paddingTop: multiline ? 25 : 12, paddingBottom: multiline ? 12 : 0, ...(style || {}) }}
      hasError={hasError ? hasError : false}
    >
      {label && <Label>{label}</Label>}

      {multiline ? (
        <textarea {...(props as TextareaProps)} style={{ height: "100%" }} />
      ) : (
        <>
          {usePostfix && (
            <div style={{ position: "relative", maxWidth: "90%" }}>
              <span>|{props.value}</span>
              <input {...(props as InputProps)} />
            </div>
          )}

          {!usePostfix && (
            <div style={{ position: "relative", width: "100%" }}>
              <input {...(props as InputProps)} style={{ position: "relative" }} />
            </div>
          )}
        </>
      )}

      {usePostfix && <Postfix style={postfixStyle}>{postfix}</Postfix>}
    </InputWrap>
  );
};

export const HereInputWithErrors: React.FC<any> = ({ errorMessage, isValid, ...restProps }) => {
  return (
    <>
      <HereInput {...restProps} hasError={errorMessage && !isValid} />
      {errorMessage && !isValid && (
        <ErrorWrapper>
          <Error className="error">{errorMessage}</Error>
        </ErrorWrapper>
      )}
    </>
  );
};

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 0.25rem;
  align-items: center;
  padding-left: 0.5rem;
`;
const Error = styled(SmallText)`
  color: ${colors.red};
  line-height: 27px;
`;
export const Label = styled.p``;
const Postfix = styled(Text)`
  margin-left: 8px;
  margin-top: 0px;
`;

export const InputWrap = styled.label<{ hasError: boolean }>`
  border: none;
  padding: 12px 16px 0;
  margin: 0;
  cursor: pointer;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.hasError ? colors.red : colors.borderHight)};
  background: ${colors.controlsSecondary};
  min-height: 56px;
  display: flex;

  transition: 0.2s box-shadow;
  align-items: center;
  position: relative;

  ${Postfix} {
    font-size: 18px;
    line-height: 25px;
    color: ${colors.blackSecondary};
    height: 24px;
  }

  ${Label} {
    transition: 0.2s all;
    color: ${colors.blackSecondary};
    margin: 0;

    top: 16px;
    position: absolute;
    color: ${colors.blackSecondary};
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }

  textarea {
    width: 100%;
  }

  input {
    width: 100%;
    position: absolute;
    left: 0;
    top: -1px;
  }

  span {
    opacity: 0;
    pointer-events: none;
    max-width: 90%;
  }

  input,
  textarea,
  span {
    font-size: 18px;
    line-height: 18px;
    outline: none;
    background: none;
    border: none;
    padding: 0;
    font-weight: 600;
    resize: none;
    color: ${colors.blackPrimary};
  }

  &:focus-within {
    box-shadow: 4px 4px 0 0 ${(props) => (props.hasError ? colors.red : colors.darkDark)};
  }

  &:focus-within,
  &.editted {
    ${Label} {
      top: 8px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
  }
`;

export default HereInput;
