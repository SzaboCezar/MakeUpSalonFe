import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.css'
})
export class UsersEditComponent implements OnInit {
  email: String;
  editMode = false;
  usersForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.email = params['email'];
        this.editMode = params['email'] != null;
        this.initForm();
      })
  }

  onSubmit() {

  }


  onAddUser() {

  }

  onDeleteUser() {

  }


  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  initForm() {
    throw new Error('Method not implemented.');
  }

}
