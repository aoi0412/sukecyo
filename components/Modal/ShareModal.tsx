import { css } from "@emotion/react";
import { FC, useState } from "react";
import Modal from "react-modal";
import { colors } from "../../styles/colors";
import CloseIcon from "../../public/cross.svg";
import StepTitle from "../Title/StepTitle";
import { useRecoilState } from "recoil";
import { currentCalendarAtom } from "../../recoil";
import CopyIcon from "../../public/copy-alt.svg";
import LinkIcon from "../../public/link.svg";

const ShareModal = () => {
  const [calendarData, setCalendarData] = useRecoilState(currentCalendarAtom);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
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
          <input
            css={css`
              font-size: 16px;
            `}
            value={calendarData?.URL}
          />
          <button
            onClick={() => {
              if (calendarData) {
                global.navigator.clipboard.writeText(calendarData.URL);
                alert("コピーしました！");
              } else {
                alert("コピーに失敗しました");
              }
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
    </>
  );
};

export default ShareModal;
