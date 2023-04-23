import { FC, HTMLProps } from "react";
import BaseIconButton from "./BaseIconButton";
import CloseIcon from "@/public/cross.svg";
import { colors } from "../../../../styles/colors";
import { css } from "@emotion/react";

type Props = HTMLProps<HTMLButtonElement>;

const CloseIconButton: FC<Props> = (props) => {
  return (
    <BaseIconButton {...props}>
      <CloseIcon
        fill={colors.white}
        css={css`
          width: 20px;
          height: 20px;
        `}
      />
    </BaseIconButton>
  );
};

export default CloseIconButton;
