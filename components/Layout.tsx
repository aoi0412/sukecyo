import { FC, ReactNode } from "react";
import Header from "./Header";
import { css } from "@emotion/react";

type Props = {
  children: ReactNode;
};
const Layout: FC<Props> = ({ children }) => {
  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
      `}
    >
      <Header />
      <main
        css={css`
          flex-grow: 1;
        `}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
