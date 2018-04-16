import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteComponent implements OnInit {

  items = [
    {
      id: 1,
      name: 'patrick',
    },{
      id: 2,
      name: 'stephanie',
    },{
      id: 3,
      name: 'eric'
    }   
  ];

  constructor() { }

  ngOnInit() {
  }

  displayUser(user: {id: string; name: string}){
    return user ? user.name : '';
  }

}
