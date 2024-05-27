import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [[CommonModule]],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  userDetails: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userDetails = this.userService.getUserDetails();
    console.log('User details in NavBar:', this.userDetails);
  }
}
