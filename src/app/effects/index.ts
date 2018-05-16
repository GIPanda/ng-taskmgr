import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { QuoteEffects } from './quote.effects';
import { AuthenEffects } from './authen.effects';
import { ProjectEffects } from './project.effects';
import { TaskListEffects } from './task-list.effects';
import { TaskEffects } from './task.effects';
import { UserEffects } from './user.effects';

@NgModule({
    imports: [
        EffectsModule.forRoot([
            QuoteEffects,
            AuthenEffects,
            ProjectEffects,
            TaskListEffects,
            TaskEffects,
            UserEffects
        ])
    ]
})
export class AppEffectsModule {}
