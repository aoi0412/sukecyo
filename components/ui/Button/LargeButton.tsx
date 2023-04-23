import { css } from "@emotion/react";
import { colors } from "../../../styles/colors";
import { FC, HTMLProps } from "react";

type Props = HTMLProps<HTMLAnchorElement>;

const LargeButton: FC<Props> = ({ children, ...rest }) => {
  return (
    <a
      {...rest}
      css={css`
        background-color: ${colors.accent};
        border-radius: 32px;
        margin: 20px;
        width: 200px;
        padding: 12px 8px;
        border: none;
        align-self: center;
        color: ${colors.white};
        font-weight: bold;
        text-align: center;
        box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1;
      `}
    >
      {children}
    </a>
  );
};

export default LargeButton;
