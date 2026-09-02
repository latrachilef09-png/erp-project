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

      const response = await api.get<AuditLog[]>("/audit-logs", {
        params,
      });

      setLogs(response.data);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [action, entity, userId, from, to]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  function clearFilters() {
    setAction("");
    setEntity("");
    setUserId("");
    setFrom("");
    setTo("");
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Audit Logs</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Action
          </label>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">All actions</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Entity
          </label>

          <input
            type="text"
            placeholder="inventory-counts"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            User ID
          </label>

          <input
            type="number"
            placeholder="1"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            From
          </label>

          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            To
          </label>

          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={loadLogs}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading audit logs...</p>
      ) : logs.length === 0 ? (
        <div className="rounded-lg border p-6 text-gray-500">
          No audit logs found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left text-gray-800">
                  Action
                </th>
                <th className="border p-3 text-left text-gray-800">
                  Entity
                </th>
                <th className="border p-3 text-left text-gray-800">
                  Entity ID
                </th>
                <th className="border p-3 text-left text-gray-800">
                  User
                </th>
                <th className="border p-3 text-left text-gray-800">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="border p-3 font-medium">
                    {log.action}
                  </td>

                  <td className="border p-3">
                    {log.entity}
                  </td>

                  <td className="border p-3">
                    {log.entityId ?? "-"}
                  </td>

                  <td className="border p-3">
                    {log.userEmail ?? "-"}
                  </td>

                  <td className="border p-3">
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