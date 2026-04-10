'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'crm_current_user_id';

export function useCurrentUserId(): {
  userId: string;
  setUserId: (value: string) => void;
} {
  const [userId, setUserIdState] = useState<string>('');

  useEffect(() => {
    const initial =
      window.localStorage.getItem(STORAGE_KEY) ?? process.env.NEXT_PUBLIC_USER_ID ?? '';
    setUserIdState(initial);
  }, []);

  const setUserId = (value: string): void => {
    setUserIdState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  return { userId, setUserId };
}
