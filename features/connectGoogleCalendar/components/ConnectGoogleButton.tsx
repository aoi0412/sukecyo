import { baseURL } from "@/components/utils/baseURL";
import { colors } from "@/styles/colors";
import { css } from "@emotion/react";
import axios from "axios";
import GoogleIcon from "@/public/google.svg";
import BaseIconButton from "@/components/ui/Button/IconButton/BaseIconButton";

const ConnectGoogleButton = () => {
  return (
    <BaseIconButton
      onClick={async () => {
        const response = await axios.get(
          `${baseURL}/api/generate-google-oauth-url`
        );
        const { authorizeUrl } = response.data;

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
    </BaseIconButton>
  );
};

export default ConnectGoogleButton;
