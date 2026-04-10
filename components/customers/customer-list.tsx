"use client";

import { useState } from "react";
import { User } from "@/types/api";
import { CustomerTable } from "./customer-table";
import { CustomerCard } from "./customer-card";
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

interface CustomerListProps {
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

type ViewMode = "table" | "cards";

export function CustomerList(props: CustomerListProps): JSX.Element {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="customer-list">
      <div className="view-toggle">
        <button
          onClick={() => setViewMode("table")}
          className={viewMode === "table" ? "active" : ""}
        >
          Table View
        </button>
        {/* <button
          onClick={() => setViewMode("cards")}
          className={viewMode === "cards" ? "active" : ""}
        >
          Card View
        </button> */}
      </div>

      {viewMode === "cards" && props.isLoading && (
        <div className="small">Loading customers...</div>
      )}
      {viewMode === "cards" && props.error && (
        <div className="error">{props.error.message}</div>
      )}
      {viewMode === "cards" && props.isFetching && !props.isLoading && (
        <div className="small">Refreshing customers...</div>
      )}

      {viewMode === "table" ? (
        <CustomerTable {...props} />
      ) : (
        <div className="customer-cards-grid">
          {props.customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              usersById={props.usersById}
              onEdit={props.onEditCustomer}
              onDelete={props.onDeleteCustomer}
              onAssign={props.onAssignCustomer}
              onViewNotes={props.onExpandNotes}
              users={props.users}
              isEditing={props.editingCustomerId === customer.id}
              editForm={props.editForm}
              onEditFormChange={props.onEditFormChange}
              onSaveEdit={(customerId) =>
                props.onUpdateCustomer(customerId, {
                  name: props.editForm.name,
                  email: props.editForm.email,
                  phone: props.editForm.phone,
                })
              }
              onCancelEdit={props.onCancelEdit}
              isUpdating={props.updatePending}
              isDeleting={props.deletePending}
              canAssignCustomer={props.canAssignCustomer}
              canDeleteCustomer={props.canDeleteCustomer}
              userId={props.userId}
              userRole={props.userRole}
            />
          ))}
          {props.customers.length === 0 && (
            <div className="no-customers">No customers found.</div>
          )}
          {props.assignError && (
            <div className="error">{props.assignError.message}</div>
          )}
          {props.updateError && (
            <div className="error">{props.updateError.message}</div>
          )}
          {props.deleteError && (
            <div className="error">{props.deleteError.message}</div>
          )}
        </div>
      )}

      {viewMode === "cards" && (
        <CustomerPagination
          hasPrevious={props.hasPrevious}
          hasNext={props.hasNext}
          onPrevious={props.onPrevious}
          onNext={props.onNext}
          isFetching={props.isFetching}
        />
      )}
    </div>
  );
}
