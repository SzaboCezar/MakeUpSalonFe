import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-users-entity',
  standalone: true,
  imports: [],
  templateUrl: './users-entity.component.html',
  styleUrl: './users-entity.component.css'
})
export class UsersEntityComponent implements OnInit {
  @Input() users: User;
  @Input() index: number;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
