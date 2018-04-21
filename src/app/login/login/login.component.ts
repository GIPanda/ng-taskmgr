import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../domain/quote.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  quote: Quote;
  constructor(private fb: FormBuilder, private quoteService$: QuoteService) { 
    this.quoteService$
      .getQuote()
      .subscribe(q => this.quote = q);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['patrickliu1989@gmail.com', Validators.compose([Validators.required, Validators.email, this.validateEmail])],
      password: ['', Validators.required]
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    console.log(JSON.stringify(value));
    console.log(JSON.stringify(valid));
    this.loginForm.controls['password'].setValidators(this.validatePwd);
  }

  validateEmail(c: FormControl): {[key: string]: any} {
    if(!c.value) {
      return null;
    }

    const pattern = /^patrick+/;
    if(pattern.test(c.value)) {
      return null
    }else {
      return {
       emailNotValid: 'The emil must start with patrick'
      };
    }    
  }

  validatePwd(c: FormControl): {[key: string]: any} {
    if(c.value.length < 4){
      return {
        pwdNotValid: 'Minimum 4 caractères'
      }
    }
  }
}
