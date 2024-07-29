import { Component } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public isLogin = true;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private readonly authService: AuthService, private router: Router) {}

  handleSubmit(authForm: NgForm): void {
    if (!authForm.valid) {
      this.showError('Email and Password are required');
      return;
    }

    
    this.authService.login(authForm.value.email, authForm.value.password).subscribe(
      response => {
        if (response.statusCode === 200) {
          const { expirationTime } = response;
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('email', response.email);
          localStorage.setItem('refreshToken', response.refreshToken);

          console.log('Expiration Date ' + expirationTime);

          this.router.navigate(['/profile']);
          this.authService.setLogoutTimer(expirationTime);
      
          
        } else {
          console.log(response.message)
          this.showError(response.message || 'An error occurred');
        }
      },
      error => {
        console.log(error.message)
        this.showError(error.message || 'An error occurred');
      }
    );
  }

  showError(mess: string): void {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  public switchToSignUp(): void {
    this.router.navigate(['/user-register']);
  }
  
  handleForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  
  getPasswordError(password: NgModel): string {
    if (password.errors) {
      if (password.errors['required']) {
        return 'Password is required.';
      }
    }
    return '';
  }
}
