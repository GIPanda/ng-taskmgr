import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { getAddrByCode, isValidAddr, extractInfoFromIdentity } from '../../utils/identity.util';
import { isValidBirthday } from '../../utils/date.util';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import * as authenActions from '../../actions/authen.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  avatars: string[] = [];
  identitySub: Subscription;
  private readonly avatarName = 'avatars';

  constructor(private fb: FormBuilder, private store$: Store<reducers.State> ) { }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.floor(Math.random() * 16).toFixed(0)}`;
    for (let i = 1; i <= 16; i++ ) {
      this.avatars.push(`avatars:svg-${i}`);
    }
    this.registerForm = this.fb.group({
      email: [],
      name: [],
      password: [],
      pwd_repeat: [],
      avatar: [img],
      birthday: ['1990-01-01'],
      address: [],
      identity: []
    });
    const identity$ = this.registerForm.get('identity').valueChanges
      .debounceTime(300)
      .filter(_ => this.registerForm.get('identity').valid);
    this.identitySub = identity$.subscribe(identity => {
      const info = extractInfoFromIdentity(identity.number);
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.registerForm.get('address').patchValue(addr);
      }
      if (isValidBirthday(info.birthday)) {
        this.registerForm.get('birthday').patchValue(info.birthday);
      }
    });
  }

  ngOnDestroy() {
    if (this.identitySub) {
      this.identitySub.unsubscribe();
    }
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (valid) {
      this.store$.dispatch(new authenActions.Register(value));
    }
  }

}
