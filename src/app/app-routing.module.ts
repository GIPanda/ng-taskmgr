import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenGuardService } from './services/authen-guard.service';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'projects', loadChildren: 'app/project#ProjectModule', pathMatch: 'full', canActivate: [AuthenGuardService]},
    { path: 'projects/:id/tasks', loadChildren: 'app/task#TaskModule', pathMatch: 'full', canActivate: [AuthenGuardService]},
    { path: 'calendar/:view', loadChildren: 'app/task-calendar#TaskCalendarModule', pathMatch: 'full', canActivate: [AuthenGuardService]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
