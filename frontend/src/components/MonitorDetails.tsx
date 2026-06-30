import { useEffect, useMemo, useState } from "react";
import { getCheckResults } from "../api/monitors";
import type { CheckResult, Monitor, MonitorStatus } from "../types/monitor";

type MonitorDetailsProps = {
  monitor: Monitor;
  onClose: () => void;
};

function getStatusClasses(status: MonitorStatus) {
  if (status === "ONLINE") {
    return "border-emerald-700 bg-emerald-950 text-emerald-300";
  }

  if (status === "OFFLINE") {
    return "border-red-700 bg-red-950 text-red-300";
  }

  return "border-zinc-700 bg-zinc-950 text-zinc-300";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Never checked";
  }

  return new Date(value).toLocaleString();
}

export function MonitorDetails({ monitor, onClose }: MonitorDetailsProps) {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChecks() {
      try {
        const data = await getCheckResults(monitor.id);
        setChecks(data);
      } catch {
        setError("Could not load check history.");
      }
    }

    loadChecks();
  }, [monitor.id]);

  const uptimePercentage = useMemo(() => {
    if (checks.length === 0) {
      return null;
    }

    const onlineChecks = checks.filter((check) => check.status === "ONLINE").length;
    return Math.round((onlineChecks / checks.length) * 100);
  }, [checks]);

  const averageResponseTime = useMemo(() => {
    const responseTimes = checks
      .map((check) => check.responseTimeMs)
      .filter((time): time is number => time !== null);

    if (responseTimes.length === 0) {
      return null;
    }

    return Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);
  }, [checks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{monitor.name}</h2>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                  monitor.currentStatus
                )}`}
              >
                {monitor.currentStatus}
              </span>
            </div>

            <p className="break-all text-sm text-zinc-400">{monitor.url}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 border-b border-zinc-800 p-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Uptime</p>
            <p className="mt-2 text-3xl font-bold">
              {uptimePercentage === null ? "—" : `${uptimePercentage}%`}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Avg. Response</p>
            <p className="mt-2 text-3xl font-bold">
              {averageResponseTime === null ? "—" : `${averageResponseTime}ms`}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Last Checked</p>
            <p className="mt-2 text-sm font-medium text-zinc-200">
              {formatDate(monitor.lastCheckedAt)}
            </p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Checks</h3>

          {error && (
            <p className="mb-4 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {checks.length === 0 ? (
            <p className="text-zinc-400">No checks recorded yet.</p>
          ) : (
            <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                        check.status
                      )}`}
                    >
                      {check.status}
                    </span>

                    <span className="text-sm text-zinc-400">
                      {formatDate(check.checkedAt)}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-400">
                    {check.responseTimeMs === null ? "—" : `${check.responseTimeMs}ms`}
                  </div>

                  {check.errorMessage && (
                    <p className="max-w-md break-all text-sm text-red-300">
                      {check.errorMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}