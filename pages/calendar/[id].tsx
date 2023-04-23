/* eslint-disable react-hooks/rules-of-hooks */
import { NextPage } from "next";
import { useRouter } from "next/router";
import EventDataPage from "@/components/page/EventDataPage";

const calendarPage: NextPage = () => {
  const router = useRouter();
  return <EventDataPage router={router} />;
};

export default calendarPage;
