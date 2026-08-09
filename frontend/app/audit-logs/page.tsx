"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  userId: number | null;
  userEmail: string | null;
  createdAt: string;
}

interface AuditLogParams {
  action?: string;
  entity?: string;
  userId?: string;
  from?: string;
  to?: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);

      const params: AuditLogParams = {};

      if (action) params.action = action;
      if (entity) params.entity = entity;
      if (userId) params.userId = userId;
      if (from) params.from = from;
      if (to) params.to = to;

      const response = await api.get<AuditLog[]>("/audit-logs", { params });

      setLogs(response.data);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [action, entity, userId, from, to]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLogs();
  }, [loadLogs]);

  function handleFilter() {
    loadLogs();
  }

  function clearFilters() {
    setAction("");
    setEntity("");
    setUserId("");
    setFrom("");
    setTo("");

    setTimeout(() => {
      loadLogs();
    }, 0);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">All actions</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Entity</label>
          <input
            type="text"
            placeholder="inventory-counts"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="number"
            placeholder="1"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleFilter}
          className="border rounded px-4 py-2"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="border rounded px-4 py-2"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p>Loading audit logs...</p>
      ) : logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2 text-left">Action</th>
                <th className="border p-2 text-left">Entity</th>
                <th className="border p-2 text-left">Entity ID</th>
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="border p-2">{log.action}</td>
                  <td className="border p-2">{log.entity}</td>
                  <td className="border p-2">{log.entityId ?? "-"}</td>
                  <td className="border p-2">{log.userEmail ?? "-"}</td>
                  <td className="border p-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}