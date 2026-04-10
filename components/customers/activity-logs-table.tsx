'use client';

import { ActivityAction, ActivityLog, User } from '@/types/api';

interface ActivityLogsTableProps {
  logs: ActivityLog[];
  usersById: Map<string, User>;
  isLoading: boolean;
  error: Error | null;
}

const actionLabels: Record<ActivityAction, string> = {
  customer_created: 'Customer created',
  customer_updated: 'Customer updated',
  customer_deleted: 'Customer deleted',
  customer_restored: 'Customer restored',
  customer_assigned: 'Customer assigned',
  note_added: 'Note added',
};

export function ActivityLogsTable({
  logs,
  usersById,
  isLoading,
  error,
}: ActivityLogsTableProps): JSX.Element {
  return (
    <div className="card stack">
      <h2>Activity Logs</h2>
      {isLoading && <div className="small">Loading activity logs...</div>}
      {error && <div className="error">{error.message}</div>}

      {!isLoading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Performed By</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{actionLabels[log.action] ?? log.action}</td>
                <td>{log.entityType}</td>
                <td>
                  {usersById.get(log.performedById)?.name ?? log.performedById}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="small">
                  No activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
