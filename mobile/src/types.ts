export type EventStatus = 'CONFIRMED' | 'CANCELLED';
 export type ZoneStatus = "OPEN" | "FULL" | "CLOSED" | "MAINTENANCE";
export interface FestivalEvent {
  id: string;
  artist: string;
  space: string;
  time: string;
  status: EventStatus;
}
export type EventInput = Omit<FestivalEvent, 'id'>;

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<Zone, "id">;