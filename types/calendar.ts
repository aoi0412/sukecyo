export type calendar = {
  name: string;
  id: string;
  URL: string;
  events: event[];
  joinMember: calendarMember;
};
export type event = {
  id: string;
  end: string;
  joinMember: string[];
  start: string;
};

export type calendarMember = { [memberId: string]: string };
