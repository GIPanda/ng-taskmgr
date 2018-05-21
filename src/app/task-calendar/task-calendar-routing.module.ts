import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CalendarHomeComponent } from './calendar-home/calendar-home.component';

const routes: Routes = [
  { path: '', component: CalendarHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskCalendarRoutingModule {}
