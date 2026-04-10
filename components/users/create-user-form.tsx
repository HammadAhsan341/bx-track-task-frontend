'use client';

import { FormEvent } from 'react';

interface CreateUserFormProps {
  form: {
    name: string;
    email: string;
    role: 'admin' | 'member';
  };
  onFormChange: (form: { name: string; email: string; role: 'admin' | 'member' }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  error: Error | null;
}

export function CreateUserForm({ form, onFormChange, onSubmit, isPending, error }: CreateUserFormProps): JSX.Element {
  return (
    <div className="card stack">
      <h2>Create User (Admin only)</h2>
      <form className="row" onSubmit={onSubmit}>
        <label htmlFor="user-name-input" className="sr-only">Name</label>
        <input
          id="user-name-input"
          placeholder="Name"
          value={form.name}
          onChange={(event) =>
            onFormChange({
              ...form,
              name: event.target.value,
            })
          }
          required
        />
        <label htmlFor="user-email-input" className="sr-only">Email</label>
        <input
          id="user-email-input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) =>
            onFormChange({
              ...form,
              email: event.target.value,
            })
          }
          required
        />
        <label htmlFor="user-role-select" className="sr-only">Role</label>
        <select
          id="user-role-select"
          value={form.role}
          onChange={(event) =>
            onFormChange({
              ...form,
              role: event.target.value as 'admin' | 'member',
            })
          }
        >
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create User'}
        </button>
      </form>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}