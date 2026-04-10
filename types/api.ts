export type UserRole = 'admin' | 'member';

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface OrganizationBootstrapResult {
  organization: Organization;
  admin: User;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationId: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  assignedTo?: User | null;
}

export interface Note {
  id: string;
  content: string;
  customerId: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  createdBy: User;
}

export type ActivityEntityType = 'customer' | 'note';

export type ActivityAction =
  | 'customer_created'
  | 'customer_updated'
  | 'customer_deleted'
  | 'customer_restored'
  | 'note_added'
  | 'customer_assigned';

export interface ActivityLog {
  id: string;
  organizationId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  performedById: string;
  metadata: Record<string, string | number | boolean | null> | null;
  timestamp: string;
}

export interface PaginatedCustomers {
  items: Customer[];
  nextCursor: string | null;
}
