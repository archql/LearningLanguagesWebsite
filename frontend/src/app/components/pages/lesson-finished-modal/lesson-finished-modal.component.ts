import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lesson-finished-modal',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './lesson-finished-modal.component.html',
  styleUrl: './lesson-finished-modal.component.scss'
})
export class LessonFinishedModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LessonFinishedModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
    this.router.navigate(['/home/dashboard']);
  }
}