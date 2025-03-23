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
 * @property {string} time - The time taken to finish the event.
 * @property {string} link - URL to event website.
 * @property {string[]} tags - An array of tags used to filter events.
 * @property {string} type - The category event.
 * @property {string[]} notes - Notes for an event.
 * @property {Array<[number, number]>} route - Coordinates for the route.
 * @property {number} rating - Subjective rating of event.
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
  time: string;
  link: string;
  tags: string[];
  type: string;
  notes: string[];
  route: Array<[number, number]>;
  rating: number;
}
