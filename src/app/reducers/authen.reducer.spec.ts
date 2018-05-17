import * as fromAuthen from './authen.reducer';
import * as actions from '../actions/authen.action';
import { async } from '@angular/core/testing';
import { Authen } from '../domain';

describe('Test AuthenReducer', () => {
  describe('Undefined Action', () => {
    it('should return default state', async(() => {
      const action = {} as any;
      const result = fromAuthen.reducer(undefined, action);
      expect(result).toEqual(fromAuthen.initialState);
    }));
  });

  describe('Login success', () => {
    it('should return an Authen object with undefined error and not empty', async(() => {
      const action = {
        type: actions.ActionTypes.LOGIN_SUCCESS,
        payload: {
          token: '',
          user: {
            id: '1',
            email: 'dev'
          }
        }
      } as any;
      const result = fromAuthen.reducer(undefined, action);
      expect(result.user).toEqual(action.payload.user);
      expect(result.err).toBeUndefined();
    }));
  });
});


