import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { getDate } from 'date-fns';
import { Project } from '../../domain';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as reducers from '../../reducers';
import * as projectActions from '../../actions/project.action';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() navClick = new EventEmitter<void>();
  today = 'day';
  projects$: Observable<Project[]>;
  constructor(private store$: Store<reducers.State>) {
    this.projects$ = this.store$.select(reducers.getProjects);
  }

  ngOnInit() {
    this.today = `day${getDate(new Date())}`;
  }

  onNavClick() {
    this.navClick.emit();
  }

  onPrjClick(project: Project) {
    this.store$.dispatch(new projectActions.Select(project));
    this.navClick.emit();
  }

}
