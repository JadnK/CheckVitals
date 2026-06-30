import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { createMonitor, deleteMonitor, getMonitors } from "./api/monitors";
import type { Monitor, MonitorStatus } from "./types/monitor";

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

function App() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function loadMonitors() {
    try {
      const data = await getMonitors();
      setMonitors(data);
    } catch {
      setError("Could not load monitors.");
    }
  }

  useEffect(() => {
    loadMonitors();

    const interval = window.setInterval(() => {
      loadMonitors();
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const stats = useMemo(() => {
    const total = monitors.length;
    const online = monitors.filter((monitor) => monitor.currentStatus === "ONLINE").length;
    const offline = monitors.filter((monitor) => monitor.currentStatus === "OFFLINE").length;
    const unknown = monitors.filter((monitor) => monitor.currentStatus === "UNKNOWN").length;

    const responseTimes = monitors
      .map((monitor) => monitor.lastResponseTimeMs)
      .filter((time): time is number => time !== null);

    const averageResponseTime =
      responseTimes.length === 0
        ? null
        : Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);

    return {
      total,
      online,
      offline,
      unknown,
      averageResponseTime,
    };
  }, [monitors]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const newMonitor = await createMonitor(name, url);
      setMonitors((current) => [newMonitor, ...current]);
      setName("");
      setUrl("");
    } catch {
      setError("Could not create monitor. Make sure the URL starts with http:// or https://");
    }
  }

  async function handleDelete(id: number) {
    setError("");

    try {
      await deleteMonitor(id);
      setMonitors((current) => current.filter((monitor) => monitor.id !== id));
    } catch {
      setError("Could not delete monitor.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-400">Monitoring Dashboard</p>
            <h1 className="text-4xl font-bold tracking-tight">UptimeWatch</h1>
            <p className="mt-3 text-zinc-400">
              Monitor websites and APIs from one clean dashboard.
            </p>
          </div>

          <div className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
            Auto-refresh every 5 Minutes
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Total</p>
            <p className="mt-2 text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Online</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{stats.online}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Offline</p>
            <p className="mt-2 text-3xl font-bold text-red-300">{stats.offline}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Unknown</p>
            <p className="mt-2 text-3xl font-bold">{stats.unknown}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Avg. Response</p>
            <p className="mt-2 text-3xl font-bold">
              {stats.averageResponseTime === null ? "—" : `${stats.averageResponseTime}ms`}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Add Monitor</h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_2fr_auto]">
            <input
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-400"
              placeholder="Name, e.g. Portfolio"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <input
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-400"
              placeholder="URL, e.g. https://jadenk.de"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />

            <button
              className="rounded-xl bg-white px-5 py-3 font-semibold text-zinc-950 hover:bg-zinc-200"
              type="submit"
            >
              Add
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-xl font-semibold">Monitors</h2>
          </div>

          {monitors.length === 0 ? (
            <div className="px-6 py-10 text-zinc-400">
              No monitors yet. Add your first website above.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {monitors.map((monitor) => (
                <div
                  key={monitor.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold">{monitor.name}</h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                          monitor.currentStatus
                        )}`}
                      >
                        {monitor.currentStatus}
                      </span>
                    </div>

                    <p className="truncate text-sm text-zinc-400">{monitor.url}</p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">
                      <span>
                        Response:{" "}
                        {monitor.lastResponseTimeMs === null
                          ? "—"
                          : `${monitor.lastResponseTimeMs}ms`}
                      </span>

                      <span>Last checked: {formatDate(monitor.lastCheckedAt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(monitor.id)}
                    className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;