import { Component, OnInit } from '@angular/core';
import { Note } from '../note.model';
import { NoteService } from '../note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteModalComponent } from '../note-modal/note-modal.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NoteModalComponent]
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  searchQuery = '';
  showSidebar = true;
  showModal = false;
  modalType: 'create' | 'edit' = 'create';

  constructor(noteService: NoteService) {
    this.noteService = noteService;
  }

  private noteService: NoteService;

  ngOnInit() {
    this.noteService.notes$.subscribe(notes => {
      this.notes = notes;
      this.applySearch();
    });
  }

  applySearch() {
    if (!this.searchQuery.trim()) {
      this.filteredNotes = this.notes;
    } else {
      const q = this.searchQuery.toLowerCase();
      this.filteredNotes = this.notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  openCreateModal() {
    this.modalType = 'create';
    this.selectedNote = null;
    this.showModal = true;
  }

  openEditModal(note: Note) {
    this.modalType = 'edit';
    this.selectedNote = { ...note };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedNote = null;
  }

  saveNote(note: {title: string, content: string}) {
    if (this.modalType === 'create') {
      this.noteService.addNote(note);
    } else if (this.modalType === 'edit' && this.selectedNote) {
      this.noteService.updateNote({
        ...this.selectedNote,
        title: note.title,
        content: note.content
      });
    }
    this.closeModal();
  }

  deleteNote(note: Note) {
    // For real usage, replace with a custom confirmation dialog/modal if required.
    this.noteService.deleteNote(note.id);
  }
}
