import Link from "next/link";
import {css} from "@emotion/react"
import { colors } from "../styles/colors";

const Header = () => {
    return (
        <div css={css`
            height:60px;
            background-color: ${colors.accent};
            width:100vw;
            display: flex;
            align-items: center;
            padding:12px;
        `}>
            <Link css={css`
                background-color: ${colors.dark};
                height:100%;
            `} href="/">Home</Link>
        </div>
    );
}

export default Header;