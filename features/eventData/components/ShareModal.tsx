import { css } from "@emotion/react";
import { useState } from "react";
import { colors } from "../../../styles/colors";
import StepTitle from "../../../components/ui/Title/StepTitle";
import { currentCalendarAtom } from "../../../components/utils/recoil";
import LinkIcon from "@/public/link.svg";
import BaseModal from "../../../components/ui/Modal/BaseModal";
import CopyIconButton from "../../../components/ui/Button/IconButton/CopyIconButton";
import { useRecoilValue } from "recoil";

const ShareModal = () => {
  const calendarData = useRecoilValue(currentCalendarAtom);
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
      <BaseModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
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
          <CopyIconButton
            onClick={() => {
              if (calendarData) {
                global.navigator.clipboard.writeText(calendarData.URL);
                alert("コピーしました！");
              } else {
                alert("コピーに失敗しました");
              }
            }}
          />
        </div>
      </BaseModal>
    </>
  );
};

export default ShareModal;
