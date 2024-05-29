import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/models/User.model';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import {
  NgbAccordionBody, NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader,
  NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgbAccordionDirective,
    NgbAccordionItem, NgbAccordionBody,
    NgbAccordionCollapse,
    NgbAccordionButton,
    NgbAccordionHeader,
    CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: `./user-list.component.scss`
})
export class UserListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  selectedUser?: User;
  users: User[];

  constructor(private userService: UserService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.subscription = this.userService.userChanged
      .subscribe((users: User[]) => {
        this.users = users;
      })
  }

  onSelect(user: User): void {
    this.selectedUser = user;
    this.userService.getUser(user.userId);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
