export type Season = {
    year: number;
    url: string;
}

export type DriverRacePoints = {
    name: string;
    country: string;
    points: number;
    position: number;
};

export type DriverPoints = {
    driverId: string;
    name: string;
    constructor: string;
    total: number;
    position: number;
    races: DriverRacePoints[];
};

export type ConstructorRacePoints = {
    name: string;
    country: string;
    points: number;
    position: number;
};

export type ConstructorPoints = {
    constructorId: string;
    constructor: string;
    total: number;
    position: number;
    races: ConstructorRacePoints[];
};

export type Race = {
    round: number;
    eventName: string;
    country: string;
    location: string;
    countryCode: string;
    slug: string;
    sessions: { name: string; date: string; time: string }[];
};

const API_BASE = "http://localhost:8000/api/f1";

export async function fetchSeasons(): Promise<Season[]> {
    const res = await fetch(`${API_BASE}/get_seasons`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid data format");
    return data;
}

export async function fetchRaceCalendar(year: number): Promise<Race[]> {
    const res = await fetch(`${API_BASE}/get_race_calendar?year=${year}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!data.calendar || !Array.isArray(data.calendar)) throw new Error("Invalid data format");
    return data.calendar;
}

export async function fetchDriverPoints(year: number): Promise<DriverPoints[]> {
    const res = await fetch(`${API_BASE}/get_driver_points/${year}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid data format");
    return data;
}

export async function fetchConstructorPoints(year: number): Promise<ConstructorPoints[]> {
    const res = await fetch(`${API_BASE}/get_constructor_points/${year}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid data format");
    return data;
}
