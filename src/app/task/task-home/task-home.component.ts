import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from '../../anims/router.anim';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {

  @HostBinding('@routeAnim') state;

  lists:any = [
    {
      id: 1,
      name: 'To do',
      order: 1,
      tasks: [
        {
          id: 1,
          desc: 'Task 1: Buy coffee in starbucks',
          completed: true,
          priority: 3,
          owner: {
            id: 1,
            name: 'Patrick',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
          reminder: new Date()
        },
        {
          id: 2,
          desc: 'Task 2: Complete PPT',
          completed: false, 
          priority: 2,                   
          owner: {
            id: 1,
            name: 'Eric',
            avatar: 'avatars:svg-12'
          },
          dueDate: new Date(),
        }
      ]
    },
    {
      id: 2,
      name: 'Doing',
      order: 2,
      tasks: [
        {
          id: 1,
          desc: 'Task 3: Code review',
          completed: false, 
          priority: 1,                   
          owner: {
            id: 1,
            name: 'Stephanie',
            avatar: 'avatars:svg-13'
          },
          dueDate: new Date(),
        },
        {
          id: 2,
          desc: 'Task 4: Project plan',
          completed: false,
          priority: 2,                 
          owner: {
            id: 1,
            name: 'Eric',
            avatar: 'avatars:svg-12'
          },
          dueDate: new Date(),
        }
      ]
    }
  ];

  constructor(private dialog:MatDialog, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  launchNewTaskDialog(){
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: 'New task'}});
    this.cd.markForCheck();
  }

  launchCopyTaskDialog(){
    const dialogRef = this.dialog.open(CopyTaskComponent, {data: {lists: this.lists}});
  }

  launchEditTaskDialog(task){
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: "Edit task", task: task}});
  }

  launchConfirmDialog(){
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {data: {dark: true, title: 'Delete tasks', content: 'Are you sure to delete all tasks ?'}}
    );
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchEditTaskListDialog(){
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: 'Edit task list'}});
  }

  launchNewTaskListDialog(){
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: 'New task list'}});
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item');
        break;
      case 'task-list':
        console.log('hadling list');
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;  
      default:
        break;
    }
  }

  handleQuickTask(desc: string) {
    console.log(desc);
  }
}
