/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";

import { useEffect, useState } from "react";
import { getCalendarListData } from "../functions/calendarList";
import { getCalendarList } from "../functions/localStorage";

import { calendar } from "../types/calendar";
import { css } from "@emotion/react";
import { colors } from "../styles/colors";
import { baseURL } from "../baseURL";
import { deleteCalendarList } from "../functions/localStorage";
import EditIcon from "../public/edit.svg";
import CloseIcon from "../public/cross.svg";
import EventTile from "../components/EventTile";
import SmallButton from "../components/Button/SmallButton";
import MiddleTitle from "../components/Title/MiddleTitle";
import IconButton from "../components/Button/IconButton";

const Home: NextPage = () => {
  const [calendarList, setCalendarList] = useState<calendar[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  useEffect(() => {
    getCalendarList().then((tmpCalendarList) => {
      console.log("get", tmpCalendarList);
      getCalendarListData(tmpCalendarList).then((calendarList) => {
        if (calendarList.length !== 0) setCalendarList(calendarList);
      });
    });
  }, []);
  return (
    <div>
      <div
        css={css`
          padding: 16px;
          display: flex;
          margin: 0 12px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid ${colors.dark};
        `}
      >
        <MiddleTitle>日程調整</MiddleTitle>
        <div
          css={css`
            display: flex;
            gap: 8px;
            align-items: center;
          `}
        >
          {isEditable ? (
            <>
              <IconButton onClick={() => setIsEditable(false)}>
                <CloseIcon
                  fill={colors.white}
                  css={css`
                    width: 16px;
                    height: 16px;
                  `}
                />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => setIsEditable(true)}>
              <EditIcon
                fill={colors.white}
                css={css`
                  width: 20px;
                  height: 20px;
                `}
              />
            </IconButton>
          )}
          <SmallButton href={`${baseURL}/createCalendar`}>新規作成</SmallButton>
        </div>
      </div>
      <div
        css={css`
          margin: 0 12px;
        `}
      >
        {calendarList.map((calendar) => (
          <EventTile
            key={calendar.id}
            calendar={calendar}
            calendarList={calendarList}
            isEditable={isEditable}
            onDelete={() => {
              deleteCalendarList(calendar.id);
              let tmpList = [...calendarList];
              tmpList = tmpList.filter((_) => _.id !== calendar.id);
              setCalendarList(tmpList);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
