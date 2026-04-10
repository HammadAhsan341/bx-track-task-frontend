"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addNote,
  assignCustomer,
  createCustomer,
  createOrganizationWithAdmin,
  createUser,
  deleteCustomer,
  getMe,
  getUsers,
  listActivityLogs,
  listCustomers,
  listNotes,
  updateCustomer,
} from "@/lib/api";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { User } from "@/types/api";
import {
  ActivityLogsTable,
  CreateCustomerForm,
  CreateOrganizationForm,
  CreateUserForm,
  CustomerList,
  NotesSection,
  UserForm,
  UserInfo,
} from "@/components";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  assignedToId: string;
}

interface OrganizationCreateForm {
  organizationName: string;
  adminName: string;
  adminEmail: string;
}

const emptyCustomerForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  assignedToId: "",
};

const emptyOrganizationCreateForm: OrganizationCreateForm = {
  organizationName: "",
  adminName: "",
  adminEmail: "",
};

const autoAssignmentEnabled =
  process.env.NEXT_PUBLIC_AUTO_ASSIGNMENT === "true";

export default function CustomersPage(): JSX.Element {
  const queryClient = useQueryClient();
  const { userId, setUserId } = useCurrentUserId();

  const [userInput, setUserInput] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([null]);
  const [activeMainTab, setActiveMainTab] = useState<"customers" | "activity" | "admin">("customers");

  const [createForm, setCreateForm] = useState<CustomerForm>(emptyCustomerForm);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );
  const [editForm, setEditForm] = useState<CustomerForm>(emptyCustomerForm);

  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(
    null,
  );
  const [noteDraft, setNoteDraft] = useState("");
  const [organizationCreateForm, setOrganizationCreateForm] =
    useState<OrganizationCreateForm>(emptyOrganizationCreateForm);

  const [userCreateForm, setUserCreateForm] = useState({
    name: "",
    email: "",
    role: "member" as "admin" | "member",
  });

  useEffect(() => {
    setUserInput(userId);
  }, [userId]);

  useEffect(() => {
    setCursorStack([null]);
  }, [debouncedSearch]);

  const currentCursor = cursorStack[cursorStack.length - 1] ?? null;

  const meQuery = useQuery({
    queryKey: ["me", userId],
    queryFn: () => getMe(userId),
    enabled: userId.length > 0,
  });

  const usersQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUsers(userId),
    enabled: userId.length > 0,
  });

  const customersQuery = useQuery({
    queryKey: ["customers", userId, debouncedSearch, currentCursor],
    queryFn: () =>
      listCustomers({
        userId,
        search: debouncedSearch,
        cursor: currentCursor,
        limit: 10,
      }),
    enabled: userId.length > 0,
  });

  const notesQuery = useQuery({
    queryKey: ["notes", userId, expandedCustomerId],
    queryFn: () => listNotes(userId, expandedCustomerId ?? ""),
    enabled: userId.length > 0 && Boolean(expandedCustomerId),
  });

  const activityLogsQuery = useQuery({
    queryKey: ["activity-logs", userId],
    queryFn: () => listActivityLogs(userId, 25),
    enabled: userId.length > 0,
  });

  const isAdmin = meQuery.data?.role === "admin";
  const canAssignCustomers = isAdmin && !autoAssignmentEnabled;
  const canDeleteCustomers = isAdmin;

  const invalidateCustomers = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: ["customers", userId] });
  };

  const invalidateActivityLogs = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: ["activity-logs", userId],
    });
  };

  const createCustomerMutation = useMutation({
    mutationFn: () =>
      createCustomer(userId, {
        name: createForm.name,
        email: createForm.email,
        phone: createForm.phone,
        assignedToId: canAssignCustomers
          ? createForm.assignedToId || undefined
          : undefined,
      }),
    onSuccess: async () => {
      setCreateForm(emptyCustomerForm);
      setCursorStack([null]);
      await Promise.all([invalidateCustomers(), invalidateActivityLogs()]);
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: (payload: {
      customerId: string;
      data: Partial<CustomerForm>;
    }) => updateCustomer(userId, payload.customerId, payload.data),
    onSuccess: async () => {
      setEditingCustomerId(null);
      await Promise.all([invalidateCustomers(), invalidateActivityLogs()]);
    },
  });

  const assignCustomerMutation = useMutation({
    mutationFn: (payload: { customerId: string; assignedUserId: string }) =>
      assignCustomer(userId, payload.customerId, payload.assignedUserId),
    onSuccess: async () => {
      await Promise.all([invalidateCustomers(), invalidateActivityLogs()]);
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (customerId: string) => deleteCustomer(userId, customerId),
    onSuccess: async () => {
      await Promise.all([invalidateCustomers(), invalidateActivityLogs()]);
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: () => addNote(userId, expandedCustomerId ?? "", noteDraft),
    onSuccess: async () => {
      setNoteDraft("");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["notes", userId, expandedCustomerId],
        }),
        invalidateActivityLogs(),
      ]);
    },
  });

  const createUserMutation = useMutation({
    mutationFn: () => createUser(userId, userCreateForm),
    onSuccess: async () => {
      setUserCreateForm({ name: "", email: "", role: "member" });
      await queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !isAdmin) {
        throw new Error("Only admins can create organizations.");
      }

      return createOrganizationWithAdmin(userId, organizationCreateForm);
    },
    onSuccess: async (result) => {
      setOrganizationCreateForm(emptyOrganizationCreateForm);
      setUserId(result.admin.id);
      setUserInput(result.admin.id);
      setCursorStack([null]);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const usersById = useMemo(() => {
    const map = new Map<string, User>();
    (usersQuery.data ?? []).forEach((u) => map.set(u.id, u));
    return map;
  }, [usersQuery.data]);

  const applyUser = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setUserId(userInput.trim());
    setCursorStack([null]);
  };

  const submitCreateCustomer = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    createCustomerMutation.mutate();
  };

  const submitCreateUser = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    createUserMutation.mutate();
  };

  const submitCreateOrganization = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    createOrganizationMutation.mutate();
  };

  const customers = customersQuery.data?.items ?? [];
  const nextCursor = customersQuery.data?.nextCursor ?? null;

  return (
    <main className="stack">
      <div className="card stack">
        <h1>Customers</h1>
        <UserForm
          userInput={userInput}
          onUserInputChange={setUserInput}
          onSubmit={applyUser}
        />
        <div className="small">
          Demo auth: every request sends <code>x-user-id</code>. Use IDs from
          the seed command output.
        </div>
        {createOrganizationMutation.data && (
          <div className="small">
            Created{" "}
            <strong>{createOrganizationMutation.data.organization.name}</strong>{" "}
            with admin{" "}
            <strong>{createOrganizationMutation.data.admin.name}</strong>. The
            admin user ID is now selected, so you can add members for this
            organization below.
          </div>
        )}

        {meQuery.isLoading && (
          <div className="small">Loading user context...</div>
        )}
        {meQuery.error && (
          <div className="error">{(meQuery.error as Error).message}</div>
        )}
        {meQuery.data && <UserInfo user={meQuery.data} />}
        {meQuery.data && (
          <div className="small">
            {isAdmin
              ? "Admin UI: create organizations, create users, assign customers, and delete customers."
              : "Member UI: customer list/create/edit/notes available. Organization creation, assign, and delete actions are hidden."}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="view-toggle" style={{ marginTop: "8px" }}>
          <button
            className={activeMainTab === "customers" ? "active" : ""}
            onClick={() => setActiveMainTab("customers")}
          >
            Customers
          </button>
          <button
            className={activeMainTab === "activity" ? "active" : ""}
            onClick={() => setActiveMainTab("activity")}
          >
            Activity Logs
          </button>
          <button
            className={activeMainTab === "admin" ? "active" : ""}
            onClick={() => setActiveMainTab("admin")}
          >
            Admin
          </button>
        </div>
      )}

      {!isAdmin && (
        <div className="view-toggle" style={{ marginTop: "8px" }}>
          <button
            className={activeMainTab === "customers" ? "active" : ""}
            onClick={() => setActiveMainTab("customers")}
          >
            Customers
          </button>
          <button
            className={activeMainTab === "activity" ? "active" : ""}
            onClick={() => setActiveMainTab("activity")}
          >
            Activity Logs
          </button>
        </div>
      )}

      {activeMainTab === "admin" && isAdmin && (
        <>
          <CreateOrganizationForm
            form={organizationCreateForm}
            onFormChange={setOrganizationCreateForm}
            onSubmit={submitCreateOrganization}
            isPending={createOrganizationMutation.isPending}
            error={createOrganizationMutation.error as Error}
          />
          <CreateUserForm
            form={userCreateForm}
            onFormChange={setUserCreateForm}
            onSubmit={submitCreateUser}
            isPending={createUserMutation.isPending}
            error={createUserMutation.error as Error}
          />
        </>
      )}

      {activeMainTab === "customers" && (
        <div className="stack">
          <CreateCustomerForm
            form={createForm}
            onFormChange={setCreateForm}
            onSubmit={submitCreateCustomer}
            users={usersQuery.data ?? []}
            canAssignCustomer={canAssignCustomers}
            autoAssignmentEnabled={autoAssignmentEnabled}
            isPending={createCustomerMutation.isPending}
            error={createCustomerMutation.error as Error}
            disabled={!userId}
          />

          <CustomerList
            customers={customers}
            users={usersQuery.data ?? []}
            usersById={usersById}
            search={search}
            onSearchChange={setSearch}
            onAssignCustomer={(customerId, assignedUserId) =>
              assignCustomerMutation.mutate({ customerId, assignedUserId })
            }
            onUpdateCustomer={(customerId, data) =>
              updateCustomerMutation.mutate({ customerId, data })
            }
            onDeleteCustomer={(customerId) =>
              deleteCustomerMutation.mutate(customerId)
            }
            onEditCustomer={(customerId, form) => {
              setEditingCustomerId(customerId);
              setEditForm(form);
            }}
            onCancelEdit={() => setEditingCustomerId(null)}
            onExpandNotes={(customerId) =>
              setExpandedCustomerId((prev) =>
                prev === customerId ? null : customerId,
              )
            }
            editingCustomerId={editingCustomerId}
            editForm={editForm}
            onEditFormChange={setEditForm}
            isLoading={customersQuery.isLoading}
            error={customersQuery.error as Error}
            assignError={assignCustomerMutation.error as Error}
            updateError={updateCustomerMutation.error as Error}
            deleteError={deleteCustomerMutation.error as Error}
            updatePending={updateCustomerMutation.isPending}
            deletePending={deleteCustomerMutation.isPending}
            assignPending={assignCustomerMutation.isPending}
            hasPrevious={cursorStack.length > 1}
            hasNext={Boolean(nextCursor)}
            onPrevious={() => setCursorStack((prev) => prev.slice(0, -1))}
            onNext={() => {
              if (!nextCursor) return;
              setCursorStack((prev) => [...prev, nextCursor]);
            }}
            isFetching={customersQuery.isFetching}
            canAssignCustomer={canAssignCustomers}
            canDeleteCustomer={canDeleteCustomers}
            userId={userId}
            userRole={meQuery.data?.role ?? "member"}
          />

          {expandedCustomerId && (
            <NotesSection
              notes={notesQuery.data ?? []}
              noteDraft={noteDraft}
              onNoteDraftChange={setNoteDraft}
              onSubmit={(event) => {
                event.preventDefault();
                addNoteMutation.mutate();
              }}
              isLoading={notesQuery.isLoading}
              error={notesQuery.error as Error}
              addError={addNoteMutation.error as Error}
              isPending={addNoteMutation.isPending}
            />
          )}
        </div>
      )}

      {activeMainTab === "activity" && (
        <ActivityLogsTable
          logs={activityLogsQuery.data ?? []}
          usersById={usersById}
          isLoading={activityLogsQuery.isLoading}
          error={activityLogsQuery.error as Error}
        />
      )}
    </main>
  );
}
