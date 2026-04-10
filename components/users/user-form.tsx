'use client';

import { FormEvent } from 'react';

interface UserFormProps {
  userInput: string;
  onUserInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function UserForm({ userInput, onUserInputChange, onSubmit }: UserFormProps): JSX.Element {
  return (
    <form className="row" onSubmit={onSubmit}>
      <label htmlFor="user-id-input" className="sr-only">User ID</label>
      <input
        id="user-id-input"
        className="user-id-input"
        value={userInput}
        onChange={(event) => onUserInputChange(event.target.value)}
        placeholder="x-user-id"
      />
      <button type="submit">Use User</button>
    </form>
  );
}