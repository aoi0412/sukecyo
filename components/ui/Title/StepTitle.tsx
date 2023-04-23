import { css } from "@emotion/react";
import { colors } from "../../../styles/colors";
import { FC } from "react";

type Props = {
  step: number;
  title: string;
};
const StepTitle: FC<Props> = ({ step, title }) => {
  return (
    <div
      css={css`
        display: flex;
        gap: 8px;
        align-items: center;
      `}
    >
      <p
        css={css`
          width: 100px;
          background-color: ${colors.sub};
          text-align: center;
          padding: 4px 8px;
          border-radius: 20px;
          color: ${colors.white};
        `}
      >
        {`STEP${step}`}
      </p>
      <p
        css={css`
          font-size: 20px;
          font-weight: bold;
        `}
      >
        {title}
      </p>
    </div>
  );
};

export default StepTitle;
