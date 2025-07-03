import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NoteModalComponent {
  @Input() type: 'create' | 'edit' = 'create';
  @Input() note: Note | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{title: string, content: string}>();

  title = '';
  content = '';

  ngOnInit() {
    if (this.type === 'edit' && this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
    } else {
      this.title = '';
      this.content = '';
    }
  }

  handleSave(event?: Event) {
    if (event) event.preventDefault();
    if (this.title.trim()) {
      this.save.emit({
        title: this.title.trim(),
        content: this.content.trim()
      });
    }
  }

  handleClose(event?: Event) {
    if (event) event.stopPropagation();
    this.close.emit();
  }
}
