import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Backend not reachable"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-4">UptimeWatch</h1>
        <p className="text-zinc-300">{message}</p>
      </div>
    </main>
  );
}

export default App;