/**
 * Represents an event.
 *
 * @interface Race
 * @property {number} id - Chronological ID for the race.
 * @property {string} date - The date of the race.
 * @property {object} location - Approximate geographic location of the race.
 * @property {number} location.lat - Latitude of the race location.
 * @property {number} location.lng - Longitude of the race location.
 * @property {string} name - The name of the race.
 * @property {string} distance - The distance of the race.
 * @property {string} time - The time taken to finish the event.
 * @property {string} link - URL to event website.
 * @property {string[]} tags - An array of tags used to filter events.
 * @property {string} type - The category race.
 */
export interface Race {
  id: number;
  date: string;
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
}
