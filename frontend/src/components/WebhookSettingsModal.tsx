import { useState } from "react";
import type { FormEvent } from "react";
import { updateWebhookSettings } from "../api/monitors";
import type { Monitor } from "../types/monitor";

type WebhookSettingsModalProps = {
  monitor: Monitor;
  onClose: () => void;
  onSaved: (updatedMonitor: Monitor) => void;
};

export function WebhookSettingsModal({
  monitor,
  onClose,
  onSaved,
}: WebhookSettingsModalProps) {
  const [webhookEnabled, setWebhookEnabled] = useState(monitor.webhookEnabled);
  const [webhookUrl, setWebhookUrl] = useState(monitor.webhookUrl ?? "");
  const [notifyOnOffline, setNotifyOnOffline] = useState(monitor.notifyOnOffline);
  const [notifyOnLagging, setNotifyOnLagging] = useState(monitor.notifyOnLagging);
  const [notifyOnOnline, setNotifyOnOnline] = useState(monitor.notifyOnOnline);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const updatedMonitor = await updateWebhookSettings(monitor.id, {
        webhookEnabled,
        webhookUrl,
        notifyOnOffline,
        notifyOnLagging,
        notifyOnOnline,
      });

      onSaved(updatedMonitor);
    } catch {
      setError("Could not save webhook settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-6">
          <div>
            <h2 className="text-2xl font-bold">Webhook Settings</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Configure notifications for {monitor.name}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={webhookEnabled}
              onChange={(event) => setWebhookEnabled(event.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Enable webhook notifications</span>
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Discord Webhook URL
            </label>

            <input
              type="url"
              value={webhookUrl}
              onChange={(event) => setWebhookUrl(event.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-zinc-400"
            />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-sm font-medium text-zinc-300">
              Send notification when status becomes:
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnOffline}
                  onChange={(event) => setNotifyOnOffline(event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-zinc-300">OFFLINE</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnLagging}
                  onChange={(event) => setNotifyOnLagging(event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-zinc-300">LAGGING</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifyOnOnline}
                  onChange={(event) => setNotifyOnOnline(event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-zinc-300">ONLINE / recovered</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}