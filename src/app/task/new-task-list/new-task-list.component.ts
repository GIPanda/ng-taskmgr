import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-task-list',
  templateUrl: './new-task-list.component.html',
  styleUrls: ['./new-task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskListComponent implements OnInit {
  title = '';
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewTaskComponent>) {

  }

  ngOnInit() {
    this.title = this.data.title;
    this.form = this.fb.group({
      name: [this.data.taskList ? this.data.taskList.name : '', Validators.required]
    });
  }

  onSubmit({value, valid}) {
    if (valid) {
      this.dialogRef.close(value);
    }
  }

}
