/* eslint-disable react-hooks/rules-of-hooks */
import { NextPage } from "next";
import { useRouter } from "next/router";
import JoinCalendarPage from "@/components/page/JoinCalendarPage";

const calendarPage: NextPage = () => {
  const router = useRouter();
  return <JoinCalendarPage router={router} />;
};

export default calendarPage;
