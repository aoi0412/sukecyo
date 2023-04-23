/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import Callback from "@/components/page/CallbackPage";

export default function callback() {
  const router = useRouter();

  return <Callback router={router} />;
}
