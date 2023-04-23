import { css } from "@emotion/react";
import { colors } from "../../styles/colors";
import { FC, HTMLProps } from "react";

type Props = HTMLProps<HTMLParagraphElement>;

const MiddleTitle: FC<Props> = ({ children, ...rest }) => {
  return (
    <p
      {...rest}
      css={css`
        background-color: ${colors.sub};
        width: 100px;
        height: 40px;
        border-radius: 24px;
        text-align: center;
        padding: 0;
        margin: 0;
        color: ${colors.white};
        line-height: 40px;
        font-weight: bold;
      `}
    >
      {children}
    </p>
  );
};

export default MiddleTitle;
