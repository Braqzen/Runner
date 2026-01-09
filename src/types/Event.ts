/**
 * Represents an event.
 *
 * @interface Event
 * @property {number} id - Chronological ID for the event.
 * @property {string} date - The date of the event.
 * @property {string} start - The time when the event starts.
 * @property {object} location - Approximate geographic location of the event.
 * @property {number} location.lat - Latitude of the event location.
 * @property {number} location.lng - Longitude of the event location.
 * @property {string} name - The name of the event.
 * @property {string} distance - The distance of the event.
 * @property {string} ascent - The ascent of the event.
 * @property {string} time - The time taken to finish the event.
 * @property {string} link - URL to event website.
 * @property {Tags} tags - An array of tags used to filter events.
 * @property {string} type - The category event.
 * @property {RaceNotes} notes - Notes for an event.
 * @property {Array<[number, number]>} route - Coordinates for the route.
 * @property {Ratings} ratings - Subjective rating of event.
 */
export interface Event {
  id: number;
  date: string;
  start: string;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  distance: string;
  ascent: string;
  time: string;
  link: string;
  tags: Tags;
  type: string;
  notes: RaceNotes;
  route: Array<[number, number]>;
  ratings: Ratings;
}

interface RaceNotes {
  pre: string[];
  during: string[];
  post: string[];
  event: string[];
  takeaways: string[];
}

interface Tags {
  date: string[];
  region: string[];
  type: string[];
}

interface Ratings {
  exertion: number;
  event_organisation: number;
  location: number;
  enjoyment: number;
}
