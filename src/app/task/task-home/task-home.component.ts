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
import * as taskListActions from '../../actions/task-list.action';
import * as taskActions from '../../actions/task.action';

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
      this.projectId$ = this.route.paramMap.map(p => p.get('id'));
      this.lists$ = this.store.select(reducers.getTasksOfLists);
    }

  ngOnInit() {
  }

  launchNewTaskDialog(list: TaskList) {
    const user$ = this.store.select(reducers.getAuthenState).map(auth => auth.user);
    user$.take(1)
      .map(user => this.dialog.open(NewTaskComponent, {data: {title: 'New task', owner: user}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(res => this.store.dispatch(
        new taskActions.Add({...res, taskListId: list, completed: false, createDate: new Date()})
      ));
    // this.cd.markForCheck();
  }

  launchCopyTaskDialog(list: TaskList) {
    this.lists$
      .map(l => l.filter(n => n.id !== list.id))
      .map(li => this.dialog.open(CopyTaskComponent, {data: {lists: li}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(res => this.store.dispatch(new taskActions.MoveAll({srcListId: list.id, targetListId: res})));
  }

  launchEditTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: 'Edit task', task: task}});
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(res => this.store.dispatch(new taskActions.Update({...task, ...res})));
  }

  launchConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {data: {dark: true, title: 'Delete tasks', content: 'Are you sure to delete all tasks ?'}}
    );
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(result => this.store.dispatch(new taskListActions.Delete(list)));
  }

  launchEditTaskListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(
      NewTaskListComponent,
      {data: {title: 'Edit task list', taskList: list}}
    );
    dialogRef.afterClosed()
      .take(1)
      .withLatestFrom(this.projectId$, (val, projectId) => ({...val, projectId: projectId}))
      .subscribe(result =>
        this.store.dispatch(new taskListActions.Update({...result, id: list.id}))
      );
  }

  launchNewTaskListDialog(ev: Event) {
    const dialogRef = this.dialog.open(
      NewTaskListComponent, {data: {title: 'New task list'}});
      dialogRef.afterClosed()
      .take(1)
      .subscribe(result =>
        this.store.dispatch(new taskListActions.Add(result))
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

  handleQuickTask(desc: string, list) {
    const user$ = this.store.select(reducers.getAuthenState).map(auth => auth.user);
    user$.take(1)
      .subscribe(user => this.store.dispatch(
        new taskActions.Add({
          desc: desc,
          priority: 3,
          taskListId: list.id,
          ownerId: user.id,
          completed: false,
          participantIds: [],
          createDate: new Date()
        })
      ));
  }
}
