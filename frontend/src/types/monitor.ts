export type MonitorStatus = "PENDING" | "LAGGING" | "ONLINE" | "OFFLINE";

export type Monitor = {
  id: number;
  name: string;
  url: string;
  currentStatus: MonitorStatus;
  lastResponseTimeMs: number | null;
  lastCheckedAt: string | null;
  createdAt: string;
};

export type CheckResult = {
  id: number;
  status: MonitorStatus;
  responseTimeMs: number | null;
  errorMessage: string | null;
  checkedAt: string;
};