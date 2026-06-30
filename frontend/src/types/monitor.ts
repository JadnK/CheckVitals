export type MonitorStatus = "UNKNOWN" | "ONLINE" | "OFFLINE";

export type Monitor = {
  id: number;
  name: string;
  url: string;
  currentStatus: MonitorStatus;
  lastResponseTimeMs: number | null;
  lastCheckedAt: string | null;
  createdAt: string;
};