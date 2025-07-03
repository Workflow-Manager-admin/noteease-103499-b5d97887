import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes.component';
import { FormsModule } from '@angular/forms';
import { NoteModalComponent } from '../note-modal/note-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NoteModalComponent,
  ],
  declarations: [
    NotesComponent,
  ],
  exports: [NotesComponent],
  bootstrap: [NotesComponent]
})
export class NotesModule { }
