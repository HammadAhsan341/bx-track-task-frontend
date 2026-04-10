import {
  ActivityLog,
  Customer,
  Note,
  OrganizationBootstrapResult,
  PaginatedCustomers,
  User,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

interface RequestOptions extends RequestInit {
  userId?: string;
}

async function apiRequest<T>(
  path: string,
  options: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (options.userId) {
    headers["x-user-id"] = options.userId;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const json = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(json.message)) {
        message = json.message.join(", ");
      } else if (json.message) {
        message = json.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getMe(userId: string): Promise<User> {
  return apiRequest<User>("/users/me", {
    method: "GET",
    userId,
  });
}

export async function createOrganizationWithAdmin(
  userId: string,
  payload: {
    organizationName: string;
    adminName: string;
    adminEmail: string;
  },
): Promise<OrganizationBootstrapResult> {
  return apiRequest<OrganizationBootstrapResult>("/organizations/bootstrap", {
    method: "POST",
    body: JSON.stringify(payload),
    userId,
  });
}

export async function getUsers(userId: string): Promise<User[]> {
  return apiRequest<User[]>("/users", {
    method: "GET",
    userId,
  });
}

export async function listCustomers(input: {
  userId: string;
  search?: string;
  cursor?: string | null;
  limit?: number;
}): Promise<PaginatedCustomers> {
  const params = new URLSearchParams();
  if (input.search) {
    params.set("search", input.search);
  }

  if (input.cursor) {
    params.set("cursor", input.cursor);
  }

  params.set("limit", String(input.limit ?? 10));

  return apiRequest<PaginatedCustomers>(`/customers?${params.toString()}`, {
    method: "GET",
    userId: input.userId,
  });
}

export async function createCustomer(
  userId: string,
  payload: {
    name: string;
    email: string;
    phone: string;
    assignedToId?: string;
  },
): Promise<Customer> {
  return apiRequest<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(payload),
    userId,
  });
}

export async function updateCustomer(
  userId: string,
  customerId: string,
  payload: { name?: string; email?: string; phone?: string },
): Promise<Customer> {
  return apiRequest<Customer>(`/customers/${customerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    userId,
  });
}

export async function assignCustomer(
  userId: string,
  customerId: string,
  assignedUserId: string,
): Promise<Customer> {
  return apiRequest<Customer>(`/customers/${customerId}/assign`, {
    method: "POST",
    body: JSON.stringify({ userId: assignedUserId }),
    userId,
  });
}

export async function deleteCustomer(
  userId: string,
  customerId: string,
): Promise<void> {
  await apiRequest<void>(`/customers/${customerId}`, {
    method: "DELETE",
    userId,
  });
}

export async function restoreCustomer(
  userId: string,
  customerId: string,
): Promise<Customer> {
  return apiRequest<Customer>(`/customers/${customerId}/restore`, {
    method: "POST",
    userId,
  });
}

export async function listNotes(
  userId: string,
  customerId: string,
): Promise<Note[]> {
  return apiRequest<Note[]>(`/customers/${customerId}/notes`, {
    method: "GET",
    userId,
  });
}

export async function addNote(
  userId: string,
  customerId: string,
  content: string,
): Promise<Note> {
  return apiRequest<Note>(`/customers/${customerId}/notes`, {
    method: "POST",
    body: JSON.stringify({ content }),
    userId,
  });
}

export async function createUser(
  userId: string,
  payload: { name: string; email: string; role: "admin" | "member" },
): Promise<User> {
  return apiRequest<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
    userId,
  });
}

export async function listActivityLogs(
  userId: string,
  limit = 20,
): Promise<ActivityLog[]> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  return apiRequest<ActivityLog[]>(`/activity-logs?${params.toString()}`, {
    method: "GET",
    userId,
  });
}
