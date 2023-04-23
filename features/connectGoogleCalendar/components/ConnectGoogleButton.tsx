import { baseURL } from "@/baseURL";
import { colors } from "@/styles/colors";
import { css } from "@emotion/react";
import axios from "axios";
import GoogleIcon from "@/public/google.svg";
import BaseIconButton from "@/components/ui/Button/IconButton/BaseIconButton";

const ConnectGoogleButton = () => {
  return (
    <>
      <button
        css={css`
          position: absolute;
          top: 80px;
          right: 12px;
          width: 40px;
          height: 40px;
          background-color: ${colors.main};
          margin: 0;
          padding: 0;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `}
        onClick={async () => {
          const response = await axios.get(
            `${baseURL}/api/generate-google-oauth-url`
          );
          const { authorizeUrl } = response.data;
          console.log("response", response);

          // Google認証ページを別タブで開く
          window.open(authorizeUrl, "_blank");
        }}
      >
        <GoogleIcon
          fill={colors.white}
          css={css`
            width: 20px;
            height: 20px;
          `}
        />
      </button>
      <BaseIconButton>
        <GoogleIcon
          fill={colors.white}
          css={css`
            width: 20px;
            height: 20px;
          `}
        />
      </BaseIconButton>
    </>
  );
};

export default ConnectGoogleButton;
