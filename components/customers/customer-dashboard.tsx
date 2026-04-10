"use client";

import { useMemo, type FormEvent, type ReactElement } from "react";
import { User } from "@/types/api";
import { CreateCustomerForm } from "./create-customer-form";
import { CustomerList } from "./customer-list";
import { CustomerStats } from "./customer-stats";
import { NotesSection } from "./notes-section";

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

interface CustomerDashboardProps {
  // Customer data
  customers: Customer[];
  users: User[];
  search: string;
  onSearchChange: (value: string) => void;

  // Form state
  createForm: CustomerForm;
  onCreateFormChange: (form: CustomerForm) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  createPending: boolean;
  createError: Error | null;

  // Edit state
  editingCustomerId: string | null;
  editForm: CustomerForm;
  onEditFormChange: (form: CustomerForm) => void;
  onEditCustomer: (customerId: string, form: CustomerForm) => void;
  onCancelEdit: () => void;
  onUpdateCustomer: (customerId: string, data: Partial<CustomerForm>) => void;
  updatePending: boolean;
  updateError: Error | null;

  // Assignment
  onAssignCustomer: (customerId: string, assignedUserId: string) => void;
  assignPending: boolean;
  assignError: Error | null;

  // Deletion
  onDeleteCustomer: (customerId: string) => void;
  deletePending: boolean;
  deleteError: Error | null;

  // Notes
  expandedCustomerId: string | null;
  onExpandNotes: (customerId: string) => void;
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdBy: { name: string };
  }>;
  noteDraft: string;
  onNoteDraftChange: (value: string) => void;
  onAddNote: (event: FormEvent<HTMLFormElement>) => void;
  addNotePending: boolean;
  addNoteError: Error | null;

  // Loading states
  isLoading: boolean;
  notesLoading: boolean;

  // Pagination
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isFetching: boolean;

  // User context
  userId: string;
  userRole?: "admin" | "member";
  autoAssignmentEnabled?: boolean;
}

export function CustomerDashboard({
  customers,
  users,
  search,
  onSearchChange,
  createForm,
  onCreateFormChange,
  onCreateSubmit,
  createPending,
  createError,
  editingCustomerId,
  editForm,
  onEditFormChange,
  onEditCustomer,
  onCancelEdit,
  onUpdateCustomer,
  updatePending,
  updateError,
  onAssignCustomer,
  assignPending,
  assignError,
  onDeleteCustomer,
  deletePending,
  deleteError,
  expandedCustomerId,
  onExpandNotes,
  notes,
  noteDraft,
  onNoteDraftChange,
  onAddNote,
  addNotePending,
  addNoteError,
  isLoading,
  notesLoading,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  isFetching,
  userId,
  userRole = "member",
  autoAssignmentEnabled = false,
}: CustomerDashboardProps): ReactElement {
  const canAssignCustomers = userRole === "admin" && !autoAssignmentEnabled;
  const canDeleteCustomers = userRole === "admin";

  const usersById = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const stats = useMemo(() => {
    const assigned = customers.filter((c) => c.assignedToId).length;
    return {
      totalCustomers: customers.length,
      assignedCustomers: assigned,
      unassignedCustomers: customers.length - assigned,
    };
  }, [customers]);

  return (
    <div className="customer-dashboard">
      <CustomerStats {...stats} />

      <CreateCustomerForm
        form={createForm}
        onFormChange={onCreateFormChange}
        onSubmit={onCreateSubmit}
        users={users}
        canAssignCustomer={canAssignCustomers}
        autoAssignmentEnabled={autoAssignmentEnabled}
        isPending={createPending}
        error={createError}
        disabled={!userId}
      />

      <CustomerList
        customers={customers}
        users={users}
        usersById={usersById}
        search={search}
        onSearchChange={onSearchChange}
        onAssignCustomer={onAssignCustomer}
        onUpdateCustomer={onUpdateCustomer}
        onDeleteCustomer={onDeleteCustomer}
        onEditCustomer={onEditCustomer}
        onCancelEdit={onCancelEdit}
        onExpandNotes={onExpandNotes}
        editingCustomerId={editingCustomerId}
        editForm={editForm}
        onEditFormChange={onEditFormChange}
        isLoading={isLoading}
        error={null}
        assignError={assignError}
        updateError={updateError}
        deleteError={deleteError}
        updatePending={updatePending}
        deletePending={deletePending}
        assignPending={assignPending}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={onPrevious}
        onNext={onNext}
        isFetching={isFetching}
        canAssignCustomer={canAssignCustomers}
        canDeleteCustomer={canDeleteCustomers}
        userId={userId}
        userRole={userRole}
      />

      {expandedCustomerId && (
        <NotesSection
          notes={notes}
          noteDraft={noteDraft}
          onNoteDraftChange={onNoteDraftChange}
          onSubmit={onAddNote}
          isLoading={notesLoading}
          error={null}
          addError={addNoteError}
          isPending={addNotePending}
        />
      )}
    </div>
  );
}
