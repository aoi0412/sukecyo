import Link from "next/link";
import { css } from "@emotion/react";
import { colors } from "../styles/colors";
import Logo from "../public/長方形.png";
import Image from "next/image";

const Header = () => {
  return (
    <div
      css={css`
        height: 80px;
        background-color: ${colors.accent};
        width: 100vw;
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        z-index: 9999;
        box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.3);
      `}
    >
      <Link
        css={css`
          height: 100%;
        `}
        href="/"
      >
        <Image src="/長方形.png" width={633 / 4} height={80} alt={""} />
      </Link>
    </div>
  );
};

export default Header;
