import { css } from "@emotion/react";
import { FC, HTMLProps } from "react";
import { colors } from "../styles/colors";
import { features } from "process";

type Props = HTMLProps<HTMLInputElement>;

const Input: FC<Props> = (props) => {
  return (
    <input
      {...props}
      css={css`
        flex-grow: 1;
        max-width: 200px;
        width: 100px;
        border: none;
        margin: 0;
        color: ${colors.dark};
        border-bottom: 2px solid ${colors.dark};
        font-size: 16px;
        ::placeholder {
          color: ${colors.dark};
        }
      `}
    />
  );
};

export default Input;
