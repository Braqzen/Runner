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
 * @property {string} distance - The planned distance of the event.
 * @property {string} ascent - The ascent of the event.
 * @property {string} time - The time taken to finish the event.
 * @property {string} time_limit - The cutoff time limit for the event.
 * @property {string} average_hr - Average heart rate during the event.
 * @property {string} max_hr - Maximum heart rate during the event.
 * @property {string} link - URL to event website.
 * @property {Tags} tags - An array of tags used to filter events.
 * @property {string} type - The category event.
 * @property {RaceNotes} notes - Notes for an event.
 * @property {Array<[number, number]>} route - Coordinates for the route.
 * @property {string} status - Status of the event: "completed" (default) or "cancelled".
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
  ascent?: string;
  time: string;
  time_limit?: string;
  average_hr?: string;
  max_hr?: string;
  link: string;
  tags: Tags;
  type: string;
  notes: RaceNotes;
  route: Array<[number, number]>;
  status?: "completed" | "cancelled";
}

interface RaceNotes {
  race: string[];
  event: string[];
  takeaways: string[];
}

interface Tags {
  date: string[];
  region: string[];
  type: string[];
}
