import { ChangeDetectionStrategy, Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import {
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder
} from '@angular/forms';
import { Address } from '../../domain/user.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { getProvinces, getCitiesByProvince, getDiscritsByCity } from '../../utils/area.util';

@Component({
  selector: 'app-area-selector',
  templateUrl: './area-selector.component.html',
  styleUrls: ['./area-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaSelectorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaSelectorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;
  private sub: Subscription;
  private propagateChange = (_: any) => {};

  constructor() { }

  ngOnInit() {
    const province$ = this._province.asObservable().startWith('');
    const city$ = this._city.asObservable().startWith('');
    const district$ = this._district.asObservable().startWith('');
    const street$ = this._street.asObservable().startWith('');
    const val$ = Observable
      .combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
        return {
          province: _p,
          city: _c,
          district: _d,
          street: _s
        };
      });
    this.sub = val$.subscribe(res => {
      this.propagateChange(res);
    });

    this.provinces$ = Observable.of(getProvinces());
    this.cities$ = province$
      .map(p => getCitiesByProvince(p as string));
    this.districts$ = Observable
      .combineLatest(province$, city$, (p, c) => getDiscritsByCity(p as string, c as string));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    } else if (val.province && val.city && val.district && val.street) {
      return null;
    } else {
      return {
        addressInvalid: true
      };
    }
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }
}
