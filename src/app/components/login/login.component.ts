import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../custom-validators';
import { catchError, finalize, of, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';
import { getFirestore, collection, where, getDocs , query} from 'firebase/firestore';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterOutlet, ReactiveFormsModule, HeaderComponent, CommonModule],
  providers: [AuthService],
})

export class LoginComponent implements OnInit {
  
  
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  authError = signal<boolean>(false);
  isLoginInProgress = signal<boolean>(false);
  ok=false;
  form = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, CustomValidators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  focusedField: string | null = null;
  login = false; 
  email = false;
  pwd = false;
  mailform = false;
  response: { user?: User } = {};
  showPassword = false;
  userExists=false;

  constructor(private formBuilder: FormBuilder,private authservice:AuthService,private router: Router) {}

  ngOnInit(): void {}

  markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }
    const email = this.form.get('email')!.value;
    const userExists = await this.checkIfUserExists(email);
    this.isLoginInProgress.set(true);
    this.userExists = userExists;
  
    if (userExists) {
     
      (await this._authService.login(this.form.controls.email.value.trim(), this.form.controls.password.value.trim()))
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.error.code === 'auth/invalid-credential') {
              console.log('mot de passe ghalet 3asba ');
              this.form.controls.password.setErrors({ incorrect: true });
            }
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
    } else {
      this.isLoginInProgress.set(false);
      this.authError.set(true); 
      
    }
  }
  

  private _handleLogin(response: any): void {
    if (!response?.user) return;
    this.login = true;
    const accessToken = response.user.accessToken;
    const user_uid = response.user.uid;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user_uid', user_uid);
    this._router.navigateByUrl('/dashboard');
  }

  handleAuthError(err: HttpErrorResponse): void {
    if (!err.error.code) return;
  
    this.authError.set(true);
    this.form.valueChanges
      .pipe(
        take(1),
        tap(() => this.authError.set(false))
      )
      .subscribe();
  }
  

  isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    }
  }

  onFocus(fieldName: string): void {
    this.focusedField = fieldName;
  }

  async onBlur(fieldName: string): Promise<void> {
    if (fieldName === 'email') {
      const email = this.form.get('email')!.value;
      const userExists = await this.checkIfUserExists(email);
      this.userExists = userExists;
      this.authError.set(!userExists); 
    }
    if (this.focusedField === fieldName) {
      this.focusedField = null;
    }
  }

  isFieldFocused(fieldName: string): boolean {
    return this.focusedField === fieldName;
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    const db = getFirestore();
    const bundleRef = collection(db, "users");
    const q1 = query(bundleRef, where("email", "==", email));
    const nompr1 = await getDocs(q1);
    return !nompr1.empty;
  }

}
