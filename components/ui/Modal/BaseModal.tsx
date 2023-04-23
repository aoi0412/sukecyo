import { css } from "@emotion/react";
import { FC, ReactNode, useState } from "react";
import ReactModal from "react-modal";
import IconButton from "../Button/IconButton/BaseIconButton";
import CloseIconButton from "../Button/IconButton/CloseIconButton";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
const BaseModal: FC<Props> = ({ children, isOpen, setIsOpen }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
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
      <CloseIconButton onClick={() => setIsOpen(false)} />
      {children}
    </ReactModal>
  );
};

export default BaseModal;
