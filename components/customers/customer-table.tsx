"use client";

import { User } from "@/types/api";
import { CustomerPagination } from "./customer-pagination";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedToId: string | null;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  assignedToId: string;
}

interface CustomerTableProps {
  customers: Customer[];
  users: User[];
  usersById: Map<string, User>;
  search: string;
  onSearchChange: (value: string) => void;
  onAssignCustomer: (customerId: string, assignedUserId: string) => void;
  onUpdateCustomer: (customerId: string, data: Partial<CustomerForm>) => void;
  onDeleteCustomer: (customerId: string) => void;
  onEditCustomer: (customerId: string, form: CustomerForm) => void;
  onCancelEdit: () => void;
  onExpandNotes: (customerId: string) => void;
  editingCustomerId: string | null;
  editForm: CustomerForm;
  onEditFormChange: (form: CustomerForm) => void;
  isLoading: boolean;
  error: Error | null;
  assignError: Error | null;
  updateError: Error | null;
  deleteError: Error | null;
  updatePending: boolean;
  deletePending: boolean;
  assignPending: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isFetching: boolean;
  canAssignCustomer: boolean;
  canDeleteCustomer: boolean;
  userId: string;
  userRole: "admin" | "member";
}

export function CustomerTable({
  customers,
  users,
  usersById,
  search,
  onSearchChange,
  onAssignCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onEditCustomer,
  onCancelEdit,
  onExpandNotes,
  editingCustomerId,
  editForm,
  onEditFormChange,
  isLoading,
  error,
  assignError,
  updateError,
  deleteError,
  updatePending,
  deletePending,
  assignPending,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  isFetching,
  canAssignCustomer,
  canDeleteCustomer,
  userId,
  userRole,
}: CustomerTableProps): JSX.Element {
  return (
    <div className="card stack">
      <div className="row justify-between align-center">
        <h2>Customer List</h2>
        <label htmlFor="search-input" className="sr-only">
          Search customers
        </label>
        <input
          id="search-input"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      {isLoading && <div className="small">Loading customers...</div>}
      {error && <div className="error">{error.message}</div>}
      {isFetching && !isLoading && (
        <div className="small">Refreshing customers...</div>
      )}

      {!isLoading && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const canEditCustomer =
                userRole === "admin" || customer.assignedToId === userId;
              return (
                <tr key={customer.id}>
                  <td>
                    {editingCustomerId === customer.id ? (
                      <>
                        <label
                          htmlFor={`edit-name-${customer.id}`}
                          className="sr-only"
                        >
                          Name
                        </label>
                        <input
                          id={`edit-name-${customer.id}`}
                          value={editForm.name}
                          onChange={(event) =>
                            onEditFormChange({
                              ...editForm,
                              name: event.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      customer.name
                    )}
                  </td>
                  <td>
                    {editingCustomerId === customer.id ? (
                      <>
                        <label
                          htmlFor={`edit-email-${customer.id}`}
                          className="sr-only"
                        >
                          Email
                        </label>
                        <input
                          id={`edit-email-${customer.id}`}
                          value={editForm.email}
                          onChange={(event) =>
                            onEditFormChange({
                              ...editForm,
                              email: event.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      customer.email
                    )}
                  </td>
                  <td>
                    {editingCustomerId === customer.id ? (
                      <>
                        <label
                          htmlFor={`edit-phone-${customer.id}`}
                          className="sr-only"
                        >
                          Phone
                        </label>
                        <input
                          id={`edit-phone-${customer.id}`}
                          value={editForm.phone}
                          onChange={(event) =>
                            onEditFormChange({
                              ...editForm,
                              phone: event.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      customer.phone
                    )}
                  </td>
                  <td>
                    {canAssignCustomer ? (
                      <>
                        <label
                          htmlFor={`assign-${customer.id}`}
                          className="sr-only"
                        >
                          Assign to user
                        </label>
                        <select
                          id={`assign-${customer.id}`}
                          value={customer.assignedToId ?? ""}
                          onChange={(event) => {
                            if (!event.target.value) {
                              return;
                            }
                            onAssignCustomer(customer.id, event.target.value);
                          }}
                          disabled={assignPending}
                        >
                          <option value="">Unassigned</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <span>
                        {customer.assignedToId
                          ? (usersById.get(customer.assignedToId)?.name ??
                            customer.assignedToId)
                          : "Unassigned"}
                      </span>
                    )}
                    <div className="small">
                      {customer.assignedToId
                        ? usersById.get(customer.assignedToId)?.email
                        : "No owner"}
                    </div>
                  </td>
                  <td>
                    <div className="row">
                      {editingCustomerId === customer.id ? (
                        <>
                          <button
                            onClick={() =>
                              onUpdateCustomer(customer.id, {
                                name: editForm.name,
                                email: editForm.email,
                                phone: editForm.phone,
                              })
                            }
                            disabled={updatePending}
                          >
                            Save
                          </button>
                          <button className="secondary" onClick={onCancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {canEditCustomer && (
                            <button
                              className="secondary"
                              onClick={() => {
                                onEditCustomer(customer.id, {
                                  name: customer.name,
                                  email: customer.email,
                                  phone: customer.phone,
                                  assignedToId: customer.assignedToId ?? "",
                                });
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className="secondary"
                            onClick={() => onExpandNotes(customer.id)}
                          >
                            Notes
                          </button>
                          {canDeleteCustomer && (
                            <button
                              className="btn-danger"
                              onClick={() => onDeleteCustomer(customer.id)}
                              disabled={deletePending}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="small">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {assignError && <div className="error">{assignError.message}</div>}
      {updateError && <div className="error">{updateError.message}</div>}
      {deleteError && <div className="error">{deleteError.message}</div>}

      <CustomerPagination
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={onPrevious}
        onNext={onNext}
        isFetching={isFetching}
      />
    </div>
  );
}
