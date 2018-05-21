import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { TaskService } from '../../services/task.service';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import { startOfDay, endOfDay } from 'date-fns';

const getColor = (priority: number) => {
  const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };

  switch (priority) {
    case 1:
      return colors.red;
    case 2:
      return colors.blue;
    default:
      return colors.yellow;
  }
};

@Component({
  selector: 'app-calendar-home',
  templateUrl: './calendar-home.component.html',
  styleUrls: ['./calendar-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHomeComponent implements OnInit {

  viewDate: Date;
  view$: Observable<string>;
  events$: Observable<CalendarEvent[]>;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<reducers.State>,
    private taskService: TaskService) {
    this.viewDate = new Date();
    this.view$ = this.route.paramMap.map(p => p.get('view'));
    this.events$ = this.store$.select(reducers.getAuthenState).map(auth => auth.user.id)
      .switchMap(userId => this.taskService.getUserTasks(userId))
      .map(tasks => tasks.map(task => ({
        start: startOfDay(task.createDate),
        end: endOfDay(task.dueDate),
        title: task.desc,
        color: getColor(task.priority)
      })));
  }

  ngOnInit() {
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('events handled');
  }
}
