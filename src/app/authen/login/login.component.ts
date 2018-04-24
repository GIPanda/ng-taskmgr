import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Quote } from '../../domain/quote.model';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducers from '../../reducers';
import * as quoteActions from '../../actions/quote.action';
import * as authenActions from '../../actions/authen.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  quote$: Observable<Quote>;
  constructor(
    private fb: FormBuilder,
    private store$: Store<reducers.State>) {
    this.quote$ = this.store$.select(reducers.getQuote);
    this.store$.dispatch(new quoteActions.Load(null));
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['patrickliu1989@gmail.com', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (valid) {
      this.store$.dispatch(new authenActions.Login(value));
    }
    this.loginForm.controls['password'].setValidators(this.validatePwd);
  }

  validatePwd(c: FormControl): {[key: string]: any} {
    if (c.value.length < 4) {
      return {
        pwdNotValid: 'Minimum 4 caractères'
      };
    }
  }
}
