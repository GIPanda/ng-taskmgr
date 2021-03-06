import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { cardAnim } from '../../anims/card.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [
    cardAnim
  ]
})
export class ProjectItemComponent implements OnInit {

  @Input() item;

  @Output() select = new EventEmitter<void>();
  @Output() invite = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @HostBinding('@card') cardState = 'out';

  constructor() { }

  ngOnInit() {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'out';
  }

  onItemClick() {
    this.select.emit();
  }

  onInviteClick(ev: Event) {
    ev.stopPropagation();
    this.invite.emit();
  }

  onEditClick(ev: Event) {
    ev.stopPropagation();
    this.edit.emit();
  }

  onDeleteClick(ev: Event) {
    ev.stopPropagation();
    this.delete.emit();
  }
}
