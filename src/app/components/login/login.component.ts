import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../custom-validators';
import { catchError, finalize, of, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [RouterOutlet, ReactiveFormsModule, HeaderComponent,CommonModule]
})
export class LoginComponent  {
  private readonly _router = inject(Router);
  private readonly _location = inject(Location);
  private readonly _authService = inject(AuthService);

  authError = signal<boolean>(false);
  isLoginInProgress = signal<boolean>(false);

  form = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, CustomValidators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  login = false; 
  email=false;
  pwd=false;
  mailform=false;
  response: { user?: User } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) this._location.back();
    }
  }


  async onSubmit(): Promise<void> {
    this.email = true;
    this.pwd = true;
    this.mailform = true;
    this.isLoginInProgress.set(true);
  
    this._authService
      .login(this.form.controls.email.value.trim(), this.form.controls.password.value.trim())
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleAuthError(error);
          return of(error);
        }),
        tap(response => this._handleLogin(response)),
        finalize(() => this.isLoginInProgress.set(false))
      )
      .subscribe({
        error: (error) => {
          console.error('Login error:', error);
        }
      });
  }
  

  private _handleLogin(response: any): void {
    if (!response?.user) return;
    this.login = true;
    const accessToken = response.user.accessToken;
    const user_uid = response.user.uid;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user_uid', user_uid);
    window.location.reload();
    this._router.navigateByUrl('/dashboard');
    
  }

  handleAuthError(err: HttpErrorResponse): void {
    if (!err.error.code) return;

    this.authError.set(true);
    this.form.valueChanges
      .pipe(
        take(1),
        tap(() => this.authError.set(true))
      )
      .subscribe();
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null
  }

 
}