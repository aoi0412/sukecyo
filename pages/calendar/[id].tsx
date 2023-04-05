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
import LinkIcon from "../../public/link.svg";
import CloseIcon from "../../public/cross.svg";
import Modal from "react-modal";
import CheckIcon from "../../public/check.svg";
import CopyIcon from "../../public/copy-alt.svg";

const calendarPage: NextPage = () => {
  const WeekChars = ["日", "月", "火", "水", "木", "金", "土"];
  const router = useRouter();
  const id = router.query.id;
  const [calendarData, setCalendarData] = useRecoilState(currentCalendarAtom);
  const [eventData, setEventData] = useRecoilState(currentEventsAtom);
  const [shareComfirmEvent, setShareConfirmEvent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
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
        <button
          onClick={() => {
            if (calendarData)
              global.navigator.clipboard.writeText(shareComfirmEvent);
            alert("コピーしました！");
          }}
          css={css`
            padding: 8px;
            background-color: ${colors.white};
            margin: 0;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            right: 12px;
          `}
        >
          <CopyIcon
            fill={colors.main}
            css={css`
              width: 20px;
              height: 20px;
            `}
          />
        </button>
        <button
          onClick={() => {
            if (calendarData.confirmedEvent) {
              const URL = createGoogleCalendarURL({
                title: calendarData.name,
                details: "details",
                start: calendarData.confirmedEvent.start,
                end: calendarData.confirmedEvent.end,
              });
              window.open(URL);
            }
          }}
        >
          カレンダーに追加する
        </button>
        <button
          onClick={() => {
            if (typeof id === "string") confirmEvents({ event: null, id: id });
            if (calendarData) {
              let tmpCalendarData: calendar = { ...calendarData };
              tmpCalendarData.confirmedEvent = null;
              setCalendarData(tmpCalendarData);
            }
          }}
        >
          cancelEvent
        </button>
      </div>
    );
  }
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        contentLabel="タイトル"
        onRequestClose={() => setIsModalOpen(false)}
        closeTimeoutMS={200}
        css={css`
          position: absolute;
          display: flex;
          align-items: center;
          flex-direction: column;
          background-color: white;
          transition: all 0.3s ease-in-out;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          padding: 8px;
          width: 60%;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
        `}
      >
        <button
          onClick={() => {
            setIsModalOpen(false);
          }}
          css={css`
            position: absolute;
            padding: 8px;
            background-color: ${colors.main};
            margin: 0;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            right: 12px;
          `}
        >
          <CloseIcon
            fill={colors.white}
            css={css`
              width: 20px;
              height: 20px;
            `}
          />
        </button>
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
          <button
            onClick={() => {
              if (calendarData)
                global.navigator.clipboard.writeText(calendarData.URL);
              alert("コピーしました！");
            }}
            css={css`
              position: absolute;
              padding: 8px;
              background-color: ${colors.white};
              margin: 0;
              border: none;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              right: 12px;
            `}
          >
            <CopyIcon
              fill={colors.main}
              css={css`
                width: 20px;
                height: 20px;
              `}
            />
          </button>
        </div>
      </Modal>
      <div
        css={css`
          display: flex;
          flex: 1;
          height: 100%;
          flex-direction: column;
          padding: 20px;
        `}
      >
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          css={css`
            position: absolute;
            padding: 8px;
            background-color: ${colors.main};
            margin: 0;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            right: 12px;
          `}
        >
          <LinkIcon
            fill={colors.white}
            css={css`
              width: 20px;
              height: 20px;
            `}
          />
          <p
            css={css`
              color: ${colors.white};
              font-weight: bold;
              padding: 0;
              margin: 0;
            `}
          >
            リンクを共有する
          </p>
        </button>
        <p
          css={css`
            font-size: 32px;
            font-weight: bold;
            text-align: center;
          `}
        >
          {calendarData?.name}
        </p>
        <div
          style={{
            zIndex: 0,
            height: "100%",
          }}
        >
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
                <div
                  css={css`
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                  `}
                >
                  <p
                    css={css`
                      height: 60px;
                      padding: 4px 12px;
                      margin: 0;
                      width: 100px;
                      text-align: center;
                    `}
                  >
                    名前
                  </p>
                  {calendarData &&
                    Object.entries(calendarData.joinMember).map(
                      ([id, name]) => {
                        return (
                          <div
                            key={id}
                            css={css`
                              height: 40px;
                            `}
                          >
                            <p
                              css={css`
                                height: 40px;
                                /* background-color: ${colors.done}; */
                                margin: 0;
                                padding: 0;
                                border: none;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                              `}
                            >
                              {name}
                            </p>
                          </div>
                        );
                      }
                    )}
                </div>
                {eventData.map((event, index) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);
                  const formatDate = `${start.getMonth()}/${start.getDate()}(${
                    WeekChars[start.getDay()]
                  })`;
                  const formatTime = `${start.getHours()}:${
                    start.getMinutes() < 10
                      ? `0${start.getMinutes()}`
                      : start.getMinutes()
                  }~${end.getHours()}:${
                    end.getMinutes() < 10
                      ? `0${end.getMinutes()}`
                      : end.getMinutes()
                  }`;
                  return (
                    <div
                      onClick={() => {
                        if (typeof id === "string")
                          confirmEvents({ event, id });
                        if (calendarData) {
                          let tmpCalendarData: calendar = { ...calendarData };
                          tmpCalendarData.confirmedEvent = event;
                          setCalendarData(tmpCalendarData);
                        }
                      }}
                      key={event.id}
                      css={css`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                      `}
                    >
                      <div
                        css={css`
                          background-color: ${colors.accent};
                          height: 60px;
                          padding: 4px 12px;
                          border-radius: 8px;
                          color: ${colors.white};
                          text-align: center;
                        `}
                      >
                        {formatDate}
                        <br />
                        {formatTime}
                      </div>
                      {calendarData &&
                        Object.entries(calendarData.joinMember).map(
                          ([id, name]) => {
                            console.log("aiueo", name);
                            return (
                              <div
                                key={id}
                                css={css`
                                  height: 40px;
                                `}
                              >
                                {event.joinMember.some(
                                  (_) => _.toString() === id
                                ) ? (
                                  <div
                                    css={css`
                                      width: 40px;
                                      height: 40px;
                                      background-color: ${colors.done};
                                      margin: 0;
                                      padding: 0;
                                      border: none;
                                      border-radius: 8px;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                    `}
                                  >
                                    <CheckIcon
                                      fill={colors.white}
                                      css={css`
                                        width: 20px;
                                        height: 20px;
                                      `}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    css={css`
                                      width: 40px;
                                      height: 40px;
                                      background-color: ${colors.dark};
                                      margin: 0;
                                      padding: 0;
                                      border: none;
                                      border-radius: 8px;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                    `}
                                  >
                                    <CloseIcon
                                      fill={colors.white}
                                      css={css`
                                        width: 20px;
                                        height: 20px;
                                      `}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* <FullCalendar
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
                <div>
                  {contentInfo.event.extendedProps.joinMember.length}人参加
                </div>
              );
            }}
          /> */}
        </div>
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
      </div>
    </>
  );
};

export default calendarPage;
