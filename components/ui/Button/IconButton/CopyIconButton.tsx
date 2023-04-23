import BaseIconButton from "./BaseIconButton";
import CopyIcon from "@/public/copy-alt.svg";
import { colors } from "@/styles/colors";
import { css } from "@emotion/react";
import { FC, HTMLProps } from "react";

type Props = HTMLProps<HTMLButtonElement>;

const CopyIconButton: FC<Props> = (props) => {
  return (
    <BaseIconButton {...props} style={{ backgroundColor: colors.white }}>
      <CopyIcon
        fill={colors.main}
        css={css`
          width: 20px;
          height: 20px;
        `}
      />
    </BaseIconButton>
  );
};

export default CopyIconButton;
