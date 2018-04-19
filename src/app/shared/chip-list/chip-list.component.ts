import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import {
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { User } from '../../domain/user.model';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipListComponent),
      multi: true
    }
  ]
})
export class ChipListComponent implements OnInit, ControlValueAccessor {

  @Input() multiple = true;
  @Input() placeholderText = 'Please enter memeber email';
  @Input() label = 'Add/edit use member';
  form: FormGroup;
  members: User[] = [];
  candidates$: Observable<User[]>;
  constructor(private fb: FormBuilder, private service: UserService) { }

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    });
    this.candidates$ = this.form.get('memberSearch').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val && val.length > 1)
      .switchMap(res => this.service.searchUsers(res));
  }

  private propagateChange = (_: any) => {};

  writeValue(obj: any): void {
    if (obj && this.multiple) {
      const userEntities = obj.reduce((a, c) => ({...a, c}), {});
      if (this.members) {
        const remaining = this.members.filter(member => !userEntities[member.id]);
        this.members = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.members = [...obj];
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  validate(c: FormControl): {[key: string]: any} {
    return this.members ? null : {
      chipListInvalid: true
    };
  }

  removeMember(member: User) {
    const i = this.members.map(u => u.id).indexOf(member.id);
    if (this.multiple) {
      this.members = [...this.members.slice(0, i), ...this.members.slice(i + 1)];
    } else {
      this.members = [];
    }
  }

  onCandidateSelect(member: User) {
    if (this.members.map(u => u.id).indexOf(member.id) === -1) {
      this.members = this.multiple ? [...this.members, member] : [member];
      this.form.patchValue({memberSearch: member.name});
      this.propagateChange(this.members);
    }
  }

  displayCandidates(user: User): string {
    return user ? user.name : '';
  }

  get displayInput() {
    return this.multiple || this.members.length === 0;
  }
}
