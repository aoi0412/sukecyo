/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { firebaseApp } from "../../firebase";
import { calendar, event } from "../../types/calendar";
import timegridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Link from "next/link";
import {
  calcRateOfMember,
  createGoogleCalendarURL,
} from "../../functions/utils";
import { isCalendar, isEvent } from "../../functions/typeCheck";
import { showError } from "../../functions/error";
import { useRecoilState } from "recoil";
import { currentCalendarAtom, currentEventsAtom } from "../../recoil";
import { confirmEvents } from "../../functions/updateCalendar";
import { colors } from "../../styles/colors";
import { css } from "@emotion/react";
import StepTitle from "../../components/StepTitle";

const calendarPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [calendarData, setCalendarData] = useRecoilState(currentCalendarAtom);
  const [eventData, setEventData] = useRecoilState(currentEventsAtom);
  const [shareComfirmEvent, setShareConfirmEvent] = useState<string>("");
  useEffect(() => {
    console.log(id);
    if (typeof id === "string") {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, "calendar", id);
      getDoc(docRef)
        .then((doc) => {
          const docData = doc.data() as calendar;
          setCalendarData(docData);
          if (docData.confirmedEvent) {
            const tmpShareText = `${docData.name}の日程が確定しました！\n ${
              docData.confirmedEvent.start
            }~${
              docData.confirmedEvent.end
            }\n カレンダーへの追加はこちらのURLから行ってください \n ${createGoogleCalendarURL(
              {
                title: docData.name,
                details: "details",
                start: docData.confirmedEvent.start,
                end: docData.confirmedEvent.end,
              }
            )}`;
            setShareConfirmEvent(tmpShareText);
          }
          console.log("docData is", docData);
          const colRef = collection(db, "calendar", id, "events");
          getDocs(colRef)
            .then((docs) => {
              let tmpEvents: event[] = [];
              docs.forEach((doc) => {
                const data = doc.data();
                if (isEvent(data)) {
                  tmpEvents.push(data);
                }
              });
              tmpEvents.sort((a, b) => {
                return a.joinMember.length < b.joinMember.length ? 1 : -1;
              });
              setEventData(tmpEvents);
            })
            .catch((error) => {
              showError({
                title: error.title,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          showError({
            title: error.title,
            message: error.message,
          });
        });
    }
  }, [id]);
  console.log(calendarData);
  if (!eventData) return <></>;
  if (calendarData && calendarData?.confirmedEvent !== null) {
    return (
      <div>
        日程は確定しました。
        <p>{calendarData?.confirmedEvent.end.toString()}</p>
        <p>{calendarData?.confirmedEvent.start.toString()}</p>
        {calendarData?.confirmedEvent.joinMember.map((id) => (
          <div key={id}>{calendarData.joinMember[id]}</div>
        ))}
        <textarea
          style={{
            width: "200px",
            height: "100px",
          }}
          value={shareComfirmEvent}
          onChange={(e) => setShareConfirmEvent(e.currentTarget.value)}
        />
        <a
          href={createGoogleCalendarURL({
            title: calendarData.name,
            details: "details",
            start: calendarData.confirmedEvent.start,
            end: calendarData.confirmedEvent.end,
          })}
        >
          カレンダーに追加する
        </a>
        <button
          onClick={() => {
            if (typeof id === "string") confirmEvents({ event: null, id: id });
          }}
        >
          cancelEvent
        </button>
      </div>
    );
  }
  return (
    <div
      css={css`
        display: flex;
        flex: 1;
        height: 100vh;
        flex-direction: column;
        padding: 20px;
      `}
    >
      <p
        css={css`
          font-size: 32px;
          font-weight: bold;
          text-align: center;
        `}
      >
        {calendarData?.name}
      </p>

      {/* <div>
        {calendarData &&
          eventData.map((event) => (
            // TODOここを実装する
            <div
              onClick={() => {
                if (typeof id === "string") confirmEvents({ event, id });
              }}
              key={event.id}
              style={{
                backgroundColor: "red",
              }}
            >
              <p>{event.id.toString()}</p>
              <p>
                rate:
                {calcRateOfMember({
                  joinMember: event.joinMember,
                  allMember: calendarData.joinMember,
                })}
              </p>
            </div>
          ))}
      </div> */}
      <FullCalendar
        scrollTime={"09:00:00"}
        height={"100%"}
        eventColor={colors.accent}
        plugins={[timegridPlugin, listPlugin]}
        events={eventData}
        headerToolbar={{
          right: "timeGridWeek,listYear,today,prev,next",
        }}
        eventContent={(contentInfo) => {
          return (
            <div>{contentInfo.event.extendedProps.joinMember.length}人参加</div>
          );
        }}
      />
      <Link
        css={css`
          width: 100%;
          background-color: ${colors.accent};
          border-radius: 32px;
          margin: 20px;
          max-width: 300px;
          padding: 12px 8px;
          border: none;
          align-self: center;
          color: ${colors.white};
          font-weight: bold;
          text-align: center;
        `}
        href={`http://localhost:3000/joinCalendar/${id}`}
      >
        自分の予定を入力する
      </Link>
      <div
        css={css`
          width: 100%;
          background-color: ${colors.main};
          padding: 20px;
          display: flex;
          justify-content: center;
        `}
      >
        <div
          css={css`
            background-color: ${colors.white};
            width: 100%;
            height: 100%;
            border-radius: 12px;
            padding: 12px;
            overflow-x: scroll;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <p
              css={css`
                padding: 0 12px;
              `}
            >
              名前
            </p>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>{" "}
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>{" "}
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>{" "}
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>{" "}
            <div
              css={css`
                background-color: ${colors.accent};
                padding: 8px;
                border-radius: 8px;
                color: ${colors.white};
                text-align: center;
              `}
            >
              3/9(月)
              <br />
              3:09~3:39
            </div>
          </div>
        </div>
      </div>
      <div
        css={css`
          background-color: ${colors.white};
          z-index: 10;
          position: fixed;
          bottom: 0;
          width: 100%;
          padding: 20px;
          align-self: center;
          box-shadow: 2px 2px 32px rgba(0, 0, 0, 0.6);
        `}
      >
        <StepTitle step={1} title="みんなに共有" />
        <div
          css={css`
            display: flex;
            align-items: center;
            width: 100%;
            margin: 0;
            padding: 0;
            justify-content: space-around;
          `}
        >
          <p>URL</p>
          <input value={calendarData?.URL} />
          <button>コピー</button>
        </div>
      </div>
    </div>
  );
};

export default calendarPage;
