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

  projects: Project[];
  sub: Subscription;

  constructor(private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private projectService: ProjectService) {
    }

  ngOnInit() {
    this.sub = this.projectService.get('37489e0c-df34-c261-71c4-ce75357e3035')
      .subscribe(projects => {
        this.projects = projects;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

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
      .map(value => ({ ...value, coverImg: this.getImg4Thumb(value.coverImg) }))
      .switchMap(value => this.projectService.add(value))
      .subscribe(project => {
        this.projects = [...this.projects, project];
        this.cd.markForCheck();
      });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
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
        .switchMap(val => this.projectService.update(val))
        .subscribe(prj => {
          const index = this.projects.map(p => p.id).indexOf(prj.id);
          this.projects = [
            ...this.projects.slice(0, index),
            prj,
            ...this.projects.slice(index + 1)
          ];
          this.cd.markForCheck();
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
      .switchMap( val => this.projectService.delete(project))
      .subscribe(prj => {
        this.projects = this.projects.filter(p => p.id !== prj.id);
        this.cd.markForCheck();
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
