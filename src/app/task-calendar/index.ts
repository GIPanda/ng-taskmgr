import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarHomeComponent } from './calendar-home/calendar-home.component';
import { CalendarModule } from 'angular-calendar';
import { TaskCalendarRoutingModule } from './task-calendar-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TaskCalendarRoutingModule,
    CalendarModule.forRoot()
  ],
  declarations: [CalendarHomeComponent]
})
export class TaskCalendarModule { }
