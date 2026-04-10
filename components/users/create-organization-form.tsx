'use client';

import { FormEvent } from 'react';

interface CreateOrganizationFormProps {
  form: {
    organizationName: string;
    adminName: string;
    adminEmail: string;
  };
  onFormChange: (form: {
    organizationName: string;
    adminName: string;
    adminEmail: string;
  }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  error: Error | null;
}

export function CreateOrganizationForm({
  form,
  onFormChange,
  onSubmit,
  isPending,
  error,
}: CreateOrganizationFormProps): JSX.Element {
  return (
    <div className="card stack">
      <h2>Create Organization + Admin</h2>
      <form className="row" onSubmit={onSubmit}>
        <label htmlFor="organization-name-input" className="sr-only">Organization Name</label>
        <input
          id="organization-name-input"
          placeholder="Organization Name"
          value={form.organizationName}
          onChange={(event) =>
            onFormChange({
              ...form,
              organizationName: event.target.value,
            })
          }
          required
        />
        <label htmlFor="organization-admin-name-input" className="sr-only">Admin Name</label>
        <input
          id="organization-admin-name-input"
          placeholder="Admin Name"
          value={form.adminName}
          onChange={(event) =>
            onFormChange({
              ...form,
              adminName: event.target.value,
            })
          }
          required
        />
        <label htmlFor="organization-admin-email-input" className="sr-only">Admin Email</label>
        <input
          id="organization-admin-email-input"
          placeholder="Admin Email"
          type="email"
          value={form.adminEmail}
          onChange={(event) =>
            onFormChange({
              ...form,
              adminEmail: event.target.value,
            })
          }
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Organization'}
        </button>
      </form>
      <div className="small">
        This creates the tenant and its first admin user in one step. After that, use the admin user to add members inside the same organization.
      </div>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
