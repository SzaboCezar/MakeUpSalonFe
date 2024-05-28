// src/app/nav-bar/nav-bar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() userDetails: any;
  private openModalTimeout: any;
  private closeModalTimeout: any;
  private isHoveringOverModal: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userDetails = this.userService.getUserDetails();
    console.log('User details in NavBar:', this.userDetails);
  }

  onMouseEnter() {
    clearTimeout(this.closeModalTimeout);
    this.openModalTimeout = setTimeout(() => this.openModal(), 300);
  }

  onMouseLeave() {
    clearTimeout(this.openModalTimeout);
    this.closeModalTimeout = setTimeout(() => this.closeModal(), 300);
  }

  keepModalOpen() {
    clearTimeout(this.closeModalTimeout);
  }

  openModal() {
    const modalElement = document.getElementById('profileModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.setAttribute('role', 'dialog');
    }
  }

  closeModal() {
    const modalElement = document.getElementById('profileModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.removeAttribute('aria-modal');
      modalElement.removeAttribute('role');
    }
  }
}
