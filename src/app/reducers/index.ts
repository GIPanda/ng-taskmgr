import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer } from '@ngrx/store';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from '@ngrx/core/compose';

import * as fromQuote from './quote.reducer';
import { environment } from '../../environments/environment';

export interface State {
    quote: fromQuote.State;
}

const initialState: State = {
    quote: fromQuote.initialState,
};

const reducers = {
    quote: fromQuote.reducer,
};

const prodReducers: ActionReducer<State> = combineReducers(reducers);
const devReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: {type: string; payload: any} ): State {
    return environment.production ?
        prodReducers(state, action) : devReducers(state, action);
}

@NgModule({
    imports: [
        StoreModule.provideStore(reducer),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
    ],
    providers: [],
})
export class AppStoreModule {}
