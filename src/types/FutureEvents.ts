export type FutureEvents = {
  registered: Category;
  deferred: Category;
};

export type FutureEvent = {
  date: string;
  location: string;
  name: string;
  link: string;
};

export type Category = {
  marathon: FutureEvent[];
  "ultra-marathon": FutureEvent[];
};
