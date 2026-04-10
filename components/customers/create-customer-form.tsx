'use client';

import { FormEvent } from 'react';
import { User } from '@/types/api';

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  assignedToId: string;
}

interface CreateCustomerFormProps {
  form: CustomerForm;
  onFormChange: (form: CustomerForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  users: User[];
  canAssignCustomer: boolean;
  autoAssignmentEnabled: boolean;
  isPending: boolean;
  error: Error | null;
  disabled: boolean;
}

export function CreateCustomerForm({
  form,
  onFormChange,
  onSubmit,
  users,
  canAssignCustomer,
  autoAssignmentEnabled,
  isPending,
  error,
  disabled,
}: CreateCustomerFormProps): JSX.Element {
  return (
    <div className="card stack">
      <h2>Create Customer</h2>
      <form className="row" onSubmit={onSubmit}>
        <label htmlFor="customer-name-input" className="sr-only">Name</label>
        <input
          id="customer-name-input"
          placeholder="Name"
          value={form.name}
          onChange={(event) => onFormChange({ ...form, name: event.target.value })}
          required
        />
        <label htmlFor="customer-email-input" className="sr-only">Email</label>
        <input
          id="customer-email-input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => onFormChange({ ...form, email: event.target.value })}
          required
        />
        <label htmlFor="customer-phone-input" className="sr-only">Phone</label>
        <input
          id="customer-phone-input"
          placeholder="Phone"
          value={form.phone}
          onChange={(event) => onFormChange({ ...form, phone: event.target.value })}
          required
        />
        {canAssignCustomer && (
          <>
            <label htmlFor="customer-assigned-select" className="sr-only">Assigned To</label>
            <select
              id="customer-assigned-select"
              value={form.assignedToId}
              onChange={(event) =>
                onFormChange({
                  ...form,
                  assignedToId: event.target.value,
                })
              }
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </>
        )}
        <button type="submit" disabled={isPending || disabled}>
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
      {autoAssignmentEnabled && (
        <div className="small">
          Auto-assignment mode is enabled. Assignment is handled without a separate assign page.
        </div>
      )}
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
