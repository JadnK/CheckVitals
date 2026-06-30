import type { CheckResult, Monitor } from "../types/monitor";

const API_BASE_URL = "/api";

export async function getMonitors(): Promise<Monitor[]> {
  const response = await fetch(`${API_BASE_URL}/monitors`);

  if (!response.ok) {
    throw new Error("Failed to fetch monitors");
  }

  return response.json();
}

export async function createMonitor(name: string, url: string): Promise<Monitor> {
  const response = await fetch(`${API_BASE_URL}/monitors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, url }),
  });

  if (!response.ok) {
    throw new Error("Failed to create monitor");
  }

  return response.json();
}

export async function deleteMonitor(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/monitors/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete monitor");
  }
  
}

export async function getCheckResults(id: number): Promise<CheckResult[]> {
  const response = await fetch(`${API_BASE_URL}/monitors/${id}/checks`);

  if (!response.ok) {
    throw new Error("Failed to fetch check results");
  }

  return response.json();
}

export async function updateWebhookSettings(
  id: number,
  settings: {
    webhookEnabled: boolean;
    webhookUrl: string;
    notifyOnOffline: boolean;
    notifyOnLagging: boolean;
    notifyOnOnline: boolean;
  }
): Promise<Monitor> {
  const response = await fetch(`${API_BASE_URL}/monitors/${id}/webhook`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error("Failed to update webhook settings");
  }

  return response.json();
}