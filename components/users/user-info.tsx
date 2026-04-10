'use client';

import { User } from '@/types/api';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps): JSX.Element {
  return (
    <div className="row">
      <span className="badge">{user.name}</span>
      <span className="badge">{user.role}</span>
      <span className="badge">org: {user.organizationId}</span>
    </div>
  );
}