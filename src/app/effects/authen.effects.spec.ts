import { TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { AuthenEffects } from './authen.effects';
import { AuthenService } from '../services/authen.service';
import * as authenActions from '../actions/authen.action';
import { Action } from '@ngrx/store';

describe('Test AuthenEffect', () => {
  beforeEach(() => {
    const actions: Observable<Action> = null;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
        // any modules needed
      ],
      providers: [
        AuthenEffects,
        provideMockActions(() => actions),
        {
          provide: AuthenService,
          useValue: jasmine.createSpyObj('authenService', ['login', 'register'])
        }
      ],
    });
  });

  function setup(methodName: string, params: {returnedAuthen: any}): AuthenEffects {
    const authenService = TestBed.get(AuthenService);
    if (params) {
      switch (methodName) {
        case 'login':
          authenService.login.and.returnValue(params.returnedAuthen);
          break;
        case 'resiger':
          authenService.register.and.returnValue(params.returnedAuthen);
          break;
        default:
          break;
      }
    }
    return TestBed.get(AuthenEffects);
  }

  it('shoud send LoginSuccess action when login is successful', fakeAsync(() => {
    const mockAuthen = {
      token: '',
      user: {
        id: '123abc',
        name: 'wang',
        email: 'wang@163.com',
        password: '123abc'
      }
    };

    const actions = new ReplaySubject(1);
    actions.next(new authenActions.Login({ email: 'wang@dev.local', password:  '123abc' }));

    const expected = new authenActions.LoginSuccess(mockAuthen);
    const authenEffects = setup('login', {returnedAuthen: Observable.of(mockAuthen)});

    authenEffects.login$.subscribe(result => {
      expect(result).toEqual(expected);
    });
  }));
});
