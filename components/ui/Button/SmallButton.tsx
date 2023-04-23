import { HTMLProps, FC } from "react";
import { colors } from "../../../styles/colors";
import { css } from "@emotion/react";
import { baseURL } from "../../utils/baseURL";

type Props = HTMLProps<HTMLAnchorElement>;

const SmallButton: FC<Props> = ({ children, ...rest }) => {
  return (
    <a
      {...rest}
      css={css`
        width: 100px;
        height: 32px;
        background-color: ${colors.accent};
        border: none;
        border-radius: 16px;
        color: ${colors.white};
        text-align: center;
        line-height: 32px;
      `}
    >
      {children}
    </a>
  );
};

export default SmallButton;
