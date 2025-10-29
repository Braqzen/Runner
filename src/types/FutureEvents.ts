export type FutureEvents = {
  registered: Category;
  deferred: Category;
};

export type FutureEvent = {
  date: string;
  location: string;
  name: string;
  distance: string | null;
  time: string | null;
  gain: string | null;
  link: string;
};

export type Category = {
  marathon: FutureEvent[];
  "ultra-marathon": FutureEvent[];
};
