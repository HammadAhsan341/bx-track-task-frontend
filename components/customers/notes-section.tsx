'use client';

import { FormEvent } from 'react';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

interface NotesSectionProps {
  notes: Note[];
  noteDraft: string;
  onNoteDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: Error | null;
  addError: Error | null;
  isPending: boolean;
}

export function NotesSection({
  notes,
  noteDraft,
  onNoteDraftChange,
  onSubmit,
  isLoading,
  error,
  addError,
  isPending,
}: NotesSectionProps): JSX.Element {
  return (
    <div className="card stack">
      <h3>Notes</h3>
      {isLoading && <div className="small">Loading notes...</div>}
      {error && <div className="error">{error.message}</div>}

      <div className="stack">
        {notes.map((note) => (
          <div key={note.id} className="card note-card">
            <div>{note.content}</div>
            <div className="small">
              {new Date(note.createdAt).toLocaleString()} by {note.createdBy.name}
            </div>
          </div>
        ))}
        {notes.length === 0 && <div className="small">No notes yet.</div>}
      </div>

      <form
        className="stack"
        onSubmit={onSubmit}
      >
        <label htmlFor="note-textarea" className="sr-only">Add note</label>
        <textarea
          id="note-textarea"
          placeholder="Add note"
          rows={3}
          value={noteDraft}
          onChange={(event) => onNoteDraftChange(event.target.value)}
          required
        />
        <button type="submit" disabled={isPending || noteDraft.trim().length === 0}>
          {isPending ? 'Saving...' : 'Add Note'}
        </button>
      </form>

      {addError && <div className="error">{addError.message}</div>}
    </div>
  );
}