import { css } from "@emotion/react";
import { colors } from "../../styles/colors";
import { FC, HTMLProps } from "react";

type Props = HTMLProps<HTMLButtonElement>;

const IconButton: FC<Props> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      type="button"
      css={css`
        width: 40px;
        height: 40px;
        background-color: ${colors.main};
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 8px;
      `}
    >
      {children}
    </button>
  );
};

export default IconButton;
