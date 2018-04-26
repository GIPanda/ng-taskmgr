import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { QuoteEffects } from './quote.effects';
import { AuthenEffects } from './authen.effects';
import { ProjectEffects } from './project.effects';

@NgModule({
    imports: [
        EffectsModule.forRoot([
            QuoteEffects,
            AuthenEffects,
            ProjectEffects
        ])
    ]
})
export class AppEffectsModule {}
