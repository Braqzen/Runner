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
}
