import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss'],
  imports : [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
})
export class NameDialogComponent {
  name: string = '';

  constructor(public dialogRef: MatDialogRef<NameDialogComponent>) {}

  onSave(): void {
    this.dialogRef.close(this.name);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
