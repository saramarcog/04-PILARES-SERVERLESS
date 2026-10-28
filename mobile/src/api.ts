import { Zone, ZoneInput } from "./types";


export const API_URL = "https://iac001c0t2.execute-api.us-east-1.amazonaws.com/dev";

export async function getZones(): Promise<Zone[]> {
  const res = await fetch(`${API_URL}/zones`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getZone(id: string): Promise<Zone> {
  const res = await fetch(`${API_URL}/zones/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createZone(data: ZoneInput) {
  const res = await fetch(`${API_URL}/zones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function replaceZone(id: string, data: ZoneInput) {
  const res = await fetch(`${API_URL}/zones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateZoneStatus(id: string, status: string) {
  const res = await fetch(`${API_URL}/zones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteZone(id: string) {
  const res = await fetch(`${API_URL}/zones/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}