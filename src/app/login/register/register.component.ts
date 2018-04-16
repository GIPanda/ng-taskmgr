import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  avatars: string[] = [];
  private readonly avatarName = 'avatars';

  constructor(private fb: FormBuilder) { }

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
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    console.log(value);
  }

}
