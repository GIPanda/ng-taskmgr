import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from '../../anims/router.anim';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TaskList } from '../../domain';
import * as taskListAction from '../../actions/task-list.action';

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
  projectId$: Observable<string>;
  lists$: Observable<TaskList[]>;

  constructor(
    private dialog: MatDialog,
    private store: Store<reducers.State>,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) {
      this.projectId$ = this.route.paramMap.pluck('id');
      this.lists$ = this.store.select(reducers.getTaskLists);
    }

  ngOnInit() {
  }

  launchNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: 'New task'}});
    this.cd.markForCheck();
  }

  launchCopyTaskDialog() {
    // const dialogRef = this.dialog.open(CopyTaskComponent, {data: {lists: this.lists}});
  }

  launchEditTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: 'Edit task', task: task}});
  }

  launchConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {data: {dark: true, title: 'Delete tasks', content: 'Are you sure to delete all tasks ?'}}
    );
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(result => this.store.dispatch(new taskListAction.Delete(list)));
  }

  launchEditTaskListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(
      NewTaskListComponent,
      {data: {title: 'Edit task list', taskList: list}}
    );
    dialogRef.afterClosed()
      .take(1)
      .subscribe(result =>
        this.store.dispatch(new taskListAction.Update({...result, id: list.id}))
      );
  }

  launchNewTaskListDialog(ev: Event) {
    const dialogRef = this.dialog.open(
      NewTaskListComponent, {data: {title: 'New task list'}});
      dialogRef.afterClosed()
      .take(1)
      .subscribe(result =>
        this.store.dispatch(new taskListAction.Add(result))
      );
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
