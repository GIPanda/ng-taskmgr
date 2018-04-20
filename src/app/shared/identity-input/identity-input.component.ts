import { ChangeDetectionStrategy, Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import {
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { Identity, IdentityType } from '../../domain/user.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  identityTypes = [
    {value: IdentityType.IdCard, label: 'ID card'},
    {value: IdentityType.Insurance, label: 'Insurance'},
    {value: IdentityType.Passport, label: 'Passport'},
    {value: IdentityType.Military, label: 'Military card'},
    {value: IdentityType.Other, label: 'Other'},
  ];
  identity: Identity = {type: null, number: null};
  private _idType = new Subject<IdentityType>();
  private _idNum = new Subject<string>();
  private sub: Subscription;

  private propagateChange = (_: any) => {};
  constructor() { }

  ngOnInit() {
    const val$ = Observable
      .combineLatest(this.idNum, this.idType, (_num, _type) => {
        return {
          type: _type,
          number: _num
        };
      });

      this.sub = val$.subscribe(identity => {
        this.propagateChange(identity);
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onIdTypeChange(value: IdentityType) {
    this._idType.next(value);
  }

  onIdNumChange(value: string) {
    this._idNum.next(value);
  }

  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  get idNum(): Observable<string> {
    return this._idNum.asObservable();
  }

  writeValue(obj: any): void {
    if (obj) {
      this.identity = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }
    switch (val.IdentityType) {
      case IdentityType.IdCard:
        return this.validateIdCard(c);
      case IdentityType.Military:
        return this.validateMilitary(c);
      case IdentityType.Passport:
        return this.validatePassport(c);
      case IdentityType.Insurance:
      default:
        break;
    }
  }

  validateIdCard(c: FormControl): {[key: string]: any} {
    const val = c.value.number;
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    if (val.length !== 18 || !pattern.test(val)) {
      return {idInvalid: true};
    } else {
      return null;
    }
  }

  validatePassport(c: FormControl): {[key: string]: any} {
    const val = c.value.number;
    const pattern = /^[GgEe]\d{8}$/;
    if (val.length !== 9 || !pattern.test(val)) {
      return {idInvalid: true};
    } else {
      return null;
    }
  }

  validateMilitary(c: FormControl): {[key: string]: any} {
    const val = c.value.number;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    if (val.length !== 9 || !pattern.test(val)) {
      return {idInvalid: true};
    } else {
      return null;
    }
  }
}
