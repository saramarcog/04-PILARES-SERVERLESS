export type ZoneStatus = "OPEN" | "FULL" | "CLOSED" | "MAINTENANCE";

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<Zone, "id">;

export const initialZones: Zone[] = [
  { id: "ZONE-01", name: "Main Stage", capacity: 5000, status: "OPEN" },
  { id: "ZONE-02", name: "Garden Stage", capacity: 2500, status: "OPEN" },
  { id: "ZONE-03", name: "Invernadero", capacity: 1800, status: "FULL" },
  { id: "ZONE-04", name: "Food Trucks", capacity: 1200, status: "CLOSED" }
];

export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};