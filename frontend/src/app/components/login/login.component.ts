import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/Auth/AuthService';
import { UserService } from 'src/services/User/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.login({ username, password });
    }
  }

  login(data: { username: string, password: string }): void {
    this.userService.loginUser(data).subscribe({
      next: (response) => {
        if (response.message === 'Login efetuado com sucesso!') {
          this.authService.login();
          this.showSuccessMessage();
          this.router.navigate(['/mapa']);
        }
      },
      error: (error) => {
        this.snackBar.open('Erro ao fazer login: ' + error.error.message, 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.userService.logoutUser();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn();
  }

  showSuccessMessage(): void {
    this.snackBar.open('Login efetuado com sucesso!', 'Fechar', {
      duration: 3000,
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
    });
  }
}
