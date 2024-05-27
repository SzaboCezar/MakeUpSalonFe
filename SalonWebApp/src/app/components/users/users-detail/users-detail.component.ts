import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../service/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Person } from '../../../models/Person.model';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.css'
})
export class UsersDetailComponent implements OnInit {
  users: User;
  persons: Person;
  email: String;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    // this.route.params
    //   .subscribe((params: Params) => {
    //     this.email = params['email'];
    //     this.userService.getUserByEmail(params['email']).subscribe((user: User) => {
    //       this.users = user;
    //     });
    //   });
  }

  onAddUser() {

  }

  onEditUser() {

  }

  onDeleteUser() {

  }

}
