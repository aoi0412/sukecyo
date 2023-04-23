import { calendar } from "../types/calendar";
import { FC } from "react";
import { css } from "@emotion/react";
import { colors } from "../styles/colors";
import TrashIcon from "../public/trash.svg";
import ArrowIcon from "../public/angle-right.svg";
import { baseURL } from "../baseURL";

type Props = {
  calendar: calendar;
  calendarList: calendar[];
  isEditable: boolean;
  onDelete: () => void;
};

const EventTile: FC<Props> = ({
  calendar,
  calendarList,
  isEditable,
  onDelete,
}) => {
  return (
    <div
      key={calendar.id}
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid ${colors.dark};
      `}
    >
      <div
        css={css`
          display: flex;
          padding: 8px;
          gap: 8px;
          align-items: center;
        `}
      >
        <div
          css={() => css`
            background-color: ${calendar.confirmedEvent
              ? colors.done
              : colors.sub};
            padding: 8px;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colors.white};
            border-radius: 8px;
            font-size: 24px;
          `}
        >
          {calendar.confirmedEvent ? "決" : "未"}
        </div>
        <p
          css={css`
            font-size: 24px;
            padding: 0;
            font-weight: bold;
            margin: 0;
          `}
        >
          {calendar.name}
        </p>
      </div>
      {isEditable ? (
        <button
          css={css`
            padding: 16px;
            margin-right: 12px;
            border: none;
            background-color: ${colors.white};
          `}
          onClick={onDelete}
        >
          <TrashIcon
            fill={colors.dark}
            css={css`
              width: 32px;
              height: 32px;
            `}
          />
        </button>
      ) : (
        <a
          href={`${baseURL}/calendar/${calendar.id}`}
          css={css`
            transition: transform 0.2s ease-in-out;
            padding: 16px;
            margin-right: 12px;
            transform: translateX(-12px);
            :hover {
              transform: translateX(0px);
            }
          `}
        >
          <ArrowIcon
            fill={colors.dark}
            css={css`
              width: 32px;
              height: 32px;
            `}
          />
        </a>
      )}
    </div>
  );
};

export default EventTile;
