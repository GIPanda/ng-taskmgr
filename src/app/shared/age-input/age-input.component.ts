import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import {
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
  subDays,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isBefore,
  parse,
  format,
  isDate,
  isValid,
  isFuture
} from 'date-fns';
import { isValidBirthday } from '../../utils/date.util';
import { Subscription } from 'rxjs/Subscription';

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface Age {
  num: number;
  unit: AgeUnit;
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    }
  ]
})
export class AgeInputComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() dayMax = 90;
  @Input() dayMin = 0;
  @Input() monthMax = 24;
  @Input() monthMin = 1;
  @Input() yearMax = 150;
  @Input() yearMin = 1;
  @Input() dateFormat = 'YYYY-MM-DD';
  @Input() debounceTime = 300;

  selectedUnit = AgeUnit.Year;
  ageUnits = [
    {value: AgeUnit.Year, label: 'Year'},
    {value: AgeUnit.Month, label: 'Month'},
    {value: AgeUnit.Day, label: 'Day'},
  ];
  form: FormGroup;
  sub: Subscription;
  private propagateChange = (_: any) => {};

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      birthday: ['', this.validateBirthday],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, {validator: this.validateAge('ageNum', 'ageUnit')})
    });
    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');

    const birthday$ = birthday.valueChanges
      .map(date => {
        return {date, from: 'birthday'};
      })
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .filter(_ => birthday.valid);
    const ageNum$ = ageNum.valueChanges
      .startWith(ageNum.value)
      .debounceTime(this.debounceTime)
      .distinctUntilChanged();
    const ageUnit$ = ageUnit.valueChanges
      .startWith(ageUnit.value)
      .debounceTime(this.debounceTime)
      .distinctUntilChanged();
    const age$ = Observable
      .combineLatest(ageNum$, ageUnit$, (num, unit) => {
        return this.ageToDate({num, unit});
      })
      .map(date => {
        return {date, from: 'age'};
      })
      .filter(_ => this.form.get('age').valid);
    const merged$ = Observable
      .merge(birthday$, age$)
      .filter(_ => this.form.valid);

    this.sub = merged$.subscribe(d => {
      const age = this.dateToAge(d.date);
      if (d.from === 'birthday') {
        if (age.num !== ageNum.value) {
          ageNum.patchValue(age.num, {emitEvent: false});
        }
        if (age.unit !== ageUnit.value) {
          this.selectedUnit = age.unit;
          ageUnit.patchValue(age.unit, {emitEvent: false});
        }
        this.propagateChange(d.date);
      } else if (d.from === 'age') {
        const ageToCompare = this.dateToAge(birthday.value);
        if (age.num !== ageToCompare.num || age.unit !== ageToCompare.unit) {
          birthday.patchValue(d.date, {emitEvent: false});
          this.propagateChange(d.date);
        }
      }
    });
  }

  ageToDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year:
        return format(subYears(now, age.num), this.dateFormat);
      case AgeUnit.Month:
        return format(subMonths(now, age.num), this.dateFormat);
      case AgeUnit.Day:
        return format(subDays(now, age.num), this.dateFormat);
      default:
        return null;
    }
  }

  dateToAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = Date.now();

    if (isBefore(subDays(now, this.dayMax), date)) {
      return {num: differenceInDays(now, date), unit: AgeUnit.Day};
    } else if (isBefore(subMonths(now, this.monthMax), date)) {
      return {num: differenceInMonths(now, date), unit: AgeUnit.Month};
    } else {
      return {num: differenceInYears(now, date), unit: AgeUnit.Year};
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val && isValidBirthday(val)) {
      return null;
    } else {
      return {
        birthFormInvalid: true
      };
    }

  }

  validateBirthday(c: FormControl): {[key: string]: any} {
    return isValidBirthday(c.value) ? null : {
        birthdayInvalid : true
      };
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      switch (ageUnit.value) {
        case AgeUnit.Year:
          result = ageNumVal >= this.yearMin && ageNumVal < this.yearMax;
          break;
        case AgeUnit.Month:
          result = ageNumVal >= this.monthMin && ageNumVal < this.monthMax;
          break;
        case AgeUnit.Day:
          result = ageNumVal >= this.dayMin && ageNumVal < this.dayMax;
          break;
        default:
          break;
      }
      return result ? null : {ageInvalid: true};
    };
  }

  writeValue(obj: any): void {
    if (obj) {
      const date = format(obj, this.dateFormat);
      const age = this.dateToAge(date);
      this.form.get('birthday').patchValue(date);
      this.form.get('age').get('ageNum').patchValue(age.num);
      this.form.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}
}
