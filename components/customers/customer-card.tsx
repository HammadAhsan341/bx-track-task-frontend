"use client";

import { User } from "@/types/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedToId: string | null;
}

interface CustomerCardProps {
  customer: Customer;
  usersById: Map<string, User>;
  onEdit: (
    customerId: string,
    form: { name: string; email: string; phone: string; assignedToId: string },
  ) => void;
  onDelete: (customerId: string) => void;
  onAssign: (customerId: string, userId: string) => void;
  onViewNotes: (customerId: string) => void;
  users: User[];
  isEditing: boolean;
  editForm: {
    name: string;
    email: string;
    phone: string;
    assignedToId: string;
  };
  onEditFormChange: (form: {
    name: string;
    email: string;
    phone: string;
    assignedToId: string;
  }) => void;
  onSaveEdit: (customerId: string) => void;
  onCancelEdit: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  canAssignCustomer: boolean;
  canDeleteCustomer: boolean;
  userId: string;
  userRole: "admin" | "member";
}

export function CustomerCard({
  customer,
  usersById,
  onEdit,
  onDelete,
  onAssign,
  onViewNotes,
  users,
  isEditing,
  editForm,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  isUpdating,
  isDeleting,
  canAssignCustomer,
  canDeleteCustomer,
  userId,
  userRole,
}: CustomerCardProps): JSX.Element {
  const canEditCustomer =
    userRole === "admin" || customer.assignedToId === userId;

  return (
    <div className="customer-card">
      <div className="customer-header">
        <h3>{customer.name}</h3>
        <div className="customer-actions">
          {isEditing ? (
            <>
              <button
                onClick={() => onSaveEdit(customer.id)}
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button onClick={onCancelEdit} className="btn-secondary">
                Cancel
              </button>
            </>
          ) : (
            <>
              {canEditCustomer && (
                <button
                  onClick={() =>
                    onEdit(customer.id, {
                      name: customer.name,
                      email: customer.email,
                      phone: customer.phone,
                      assignedToId: customer.assignedToId ?? "",
                    })
                  }
                  className="btn-secondary"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => onViewNotes(customer.id)}
                className="btn-secondary"
              >
                Notes
              </button>
              {canDeleteCustomer && (
                <button
                  onClick={() => onDelete(customer.id)}
                  disabled={isDeleting}
                  className="btn-danger"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="customer-details">
        <div className="detail-row">
          <label htmlFor={`email-${customer.id}`}>Email:</label>
          {isEditing ? (
            <input
              id={`email-${customer.id}`}
              type="email"
              value={editForm.email}
              onChange={(e) =>
                onEditFormChange({ ...editForm, email: e.target.value })
              }
            />
          ) : (
            <span>{customer.email}</span>
          )}
        </div>

        <div className="detail-row">
          <label htmlFor={`phone-${customer.id}`}>Phone:</label>
          {isEditing ? (
            <input
              id={`phone-${customer.id}`}
              value={editForm.phone}
              onChange={(e) =>
                onEditFormChange({ ...editForm, phone: e.target.value })
              }
            />
          ) : (
            <span>{customer.phone}</span>
          )}
        </div>

        <div className="detail-row">
          <label htmlFor={`assigned-${customer.id}`}>Assigned to:</label>
          {canAssignCustomer ? (
            <select
              id={`assigned-${customer.id}`}
              value={
                isEditing
                  ? editForm.assignedToId
                  : (customer.assignedToId ?? "")
              }
              onChange={(e) => {
                if (isEditing) {
                  onEditFormChange({
                    ...editForm,
                    assignedToId: e.target.value,
                  });
                } else if (e.target.value) {
                  onAssign(customer.id, e.target.value);
                }
              }}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          ) : (
            <span>
              {customer.assignedToId
                ? (usersById.get(customer.assignedToId)?.name ??
                  customer.assignedToId)
                : "Unassigned"}
            </span>
          )}
        </div>

        {customer.assignedToId && (
          <div className="detail-row">
            <span className="small">
              Owner: {usersById.get(customer.assignedToId)?.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
