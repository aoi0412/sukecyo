/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import CreateCalendarPage from "@/components/page/CreateCalendarPage";
const createCalendar = () => {
  const router = useRouter();
  return <CreateCalendarPage router={router} />;
};

export default createCalendar;
