
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    
    this.adminService.getAllUsers().subscribe(
      response => {
        if (response && response.statusCode === 200 && response.usersList) {
          console.log(response)
          this.users = response.usersList;
        } else {
          this.showError('No users found.');
        }
      },
      error => {
        this.showError(error.message);
      }
    );
  }

  deleteUser(userId: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.adminService.deleteUser(userId).subscribe(
        () => {
          this.loadUsers();
        },
        error => {
          this.showError(error.message);
        }
      );
    }
  }

  navigateToUpdate(userId: string): void {
    this.router.navigate(['/update', userId]);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; 
    }, 3000);
  }
}
