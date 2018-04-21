import * as quoteAction from '../actions/quote.action';
import { Quote } from '../domain/quote.model';

export interface State {
    quote: Quote;
}

export const initialState: State = {
    quote: {
        cn: '被击垮通常只是暂时的，但如果你放弃的话，就会使它成为永恒。（Marilyn vos Savant）',
        en: 'Being defeated is often a temporary condition. Giving up is what makes it permanent.',
        pic: '/assets/img/quotes/1.jpg'
    }
};

export function reducer(state = initialState, action: {type: string; payload: any } ): State {
    switch (action.type) {
        case quoteAction.QUOTE_SUCCESS: {
            return {...state, quote: action.payload};
        }
        case quoteAction.QUOTE_FAIL:
        default: {
            return state;
        }
    }
}
