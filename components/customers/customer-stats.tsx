"use client";

interface CustomerStatsProps {
  totalCustomers: number;
  assignedCustomers: number;
  unassignedCustomers: number;
}

export function CustomerStats({
  totalCustomers,
  assignedCustomers,
  unassignedCustomers,
}: CustomerStatsProps): JSX.Element {
  return (
    <div className="customer-stats">
      <div className="stat-card">
        <div className="stat-number">{totalCustomers}</div>
        <div className="stat-label">Total Customers</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{assignedCustomers}</div>
        <div className="stat-label">Assigned</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{unassignedCustomers}</div>
        <div className="stat-label">Unassigned</div>
      </div>
    </div>
  );
}
