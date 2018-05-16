import {
  Component,
  OnInit,
  OnDestroy,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';
import { NewProjectComponent } from '../new-project/new-project.component';
import { MatDialog } from '@angular/material';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim';
import { Project } from '../../domain';
import { ProjectService } from '../../services/project.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import { Observable } from 'rxjs/Observable';
import * as projectActions from '../../actions/project.action';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight, listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  projects$: Observable<Project[]>;
  listAnim$: Observable<number>;

  constructor(private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private projectService: ProjectService,
    private store$: Store<reducers.State>
  ) {
    this.store$.dispatch(new projectActions.Load(null));
    this.projects$ = this.store$.select(reducers.getProjects);
    this.listAnim$ = this.projects$.map(p => p.length);
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  openNewProjectDialog() {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(
      NewProjectComponent,
      {
        data: {
          thumbnails: this.getThumbnails(),
          defaultCover: selectedImg
        }
      }
    );
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(project => {
        this.store$.dispatch(new projectActions.Add(project));
      });
  }

  selectProject(project: Project) {
    this.store$.dispatch(new projectActions.Select(project));
  }

  launchInviteDialog(project: Project) {
    this.store$.select(reducers.getProjectUsers(project.id))
      .map(users => this.dialog.open(InviteComponent, {data: {members: users}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(res => this.store$.dispatch(new projectActions.Invite({projectId: project.id, members: res})));
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(
      NewProjectComponent,
      {
        data: {
          thumbnails: this.getThumbnails(),
          project: project
        }
      });
      dialogRef.afterClosed()
        .take(1)
        .filter(n => n)
        .map(val => ({ ...val, id: project.id, coverImg: this.getImg4Thumb(val.coverImg) }))
        .subscribe(prj => {
          this.store$.dispatch(new projectActions.Update(prj));
        });

  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {data: {dark: true, title: 'Delete project', content: 'Are you sure to delete this project ?'}}
    );
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(() => {
        this.store$.dispatch(new projectActions.Delete(project));
      });
  }

  private getThumbnails() {
    return _.range(0, 40)
      .map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private getImg4Thumb(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }
}
