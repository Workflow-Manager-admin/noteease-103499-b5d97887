import { Injectable } from '@angular/core';
import { Note } from './note.model';
import { BehaviorSubject, Observable } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notesSubject = new BehaviorSubject<Note[]>(this.loadNotes());
  notes$ = this.notesSubject.asObservable();

  // PUBLIC_INTERFACE
  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void {
    const notes = this.loadNotes();
    const newNote: Note = {
      ...note,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    notes.unshift(newNote);
    this.saveNotes(notes);
    this.notesSubject.next(notes);
  }

  // PUBLIC_INTERFACE
  updateNote(updatedNote: Note): void {
    const notes = this.loadNotes().map(n =>
      n.id === updatedNote.id
        ? { ...updatedNote, updatedAt: new Date() }
        : n
    );
    this.saveNotes(notes);
    this.notesSubject.next(notes);
  }

  // PUBLIC_INTERFACE
  deleteNote(noteId: number): void {
    const notes = this.loadNotes().filter(n => n.id !== noteId);
    this.saveNotes(notes);
    this.notesSubject.next(notes);
  }

  // PUBLIC_INTERFACE
  searchNotes(query: string): Observable<Note[]> {
    const lower = query.toLowerCase();
    return new BehaviorSubject(
      this.loadNotes().filter(
        n =>
          n.title.toLowerCase().includes(lower) ||
          n.content.toLowerCase().includes(lower)
      )
    ).asObservable();
  }

  // PUBLIC_INTERFACE
  getNoteById(id: number): Note | undefined {
    return this.loadNotes().find((n) => n.id === id);
  }

  // PUBLIC_INTERFACE
  getAll(): Note[] {
    return this.loadNotes();
  }

  // Local persistence helpers
  private loadNotes(): Note[] {
    if (typeof globalThis === 'undefined' || typeof globalThis.localStorage === 'undefined') {
      return [];
    }
    let notes: Note[] = [];
    try {
      notes = JSON.parse(globalThis.localStorage.getItem('notes') || '[]');
      notes = notes.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt)
      }));
    } catch { notes = []; }
    return notes;
  }

  private saveNotes(notes: Note[]) {
    if (typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined') {
      globalThis.localStorage.setItem('notes', JSON.stringify(notes));
    }
  }
}
