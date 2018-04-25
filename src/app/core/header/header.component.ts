import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Authen } from '../../domain';
import * as reducers from '../../reducers';
import * as authenAction from '../../actions/authen.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  authen$: Observable<Authen>;
  @Output()
  toggle = new EventEmitter<void>();
  @Output()
  toggleDarkTheme = new EventEmitter<boolean>();

  constructor(private store$: Store<reducers.State>) {
    this.authen$ = this.store$.select(reducers.getAuthenState);
  }

  ngOnInit() {
  }

  toggleSidebar() {
    this.toggle.emit();
  }

  toggleNightMode(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }

  logout() {
    this.store$.dispatch(new authenAction.Logout(null));
  }

}
