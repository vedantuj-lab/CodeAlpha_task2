import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Clock } from 'lucide-react';
import { adminService } from '../services/adminService';
import { AdminActivityItem } from '../types';

export const AdminActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await adminService.getActivityLogs();
    setLogs(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
          Application Activity Log
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Audit trail of administrative events, role changes, and system configuration updates.
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-[var(--text-secondary)]">
            Loading activity records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] text-[var(--text-secondary)] space-y-2">
            <Activity className="w-8 h-8 opacity-40 mx-auto" />
            <p className="text-sm font-semibold">No administrative events recorded</p>
            <p className="text-xs">Security actions and role modifications will appear here.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-[var(--surface-calc)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[var(--accent-orange)] px-2 py-0.5 rounded bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)]">
                    {log.action}
                  </span>
                  <span className="text-[var(--text-primary)] font-semibold">Target: {log.targetType}</span>
                </div>
                {log.metadata && (
                  <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                    Details: {JSON.stringify(log.metadata)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] font-mono shrink-0">
                <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
