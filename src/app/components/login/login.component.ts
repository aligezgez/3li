import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { dashboardComponent } from '../dashboard/dashboard.component';
import { FormBuilder, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { Router } from 'express';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [HeaderComponent,dashboardComponent,CommonModule,ReactiveFormsModule]
})
export class LoginComponent {
  
    isLoginInProgress: boolean | undefined;
    errorMessage: string | null = null; 
    
    form = this.fb.nonNullable.group({ 
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    
    constructor(
      private fb: FormBuilder, 
      private authService: AuthService,
      ) {
      
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        window.history.back();
      }
    }
     router = inject(Router);
  
    // fb = inject(FormBuilder);
    // http = inject(HttpClient);
    //  authService = inject(AuthService);
    data: any[] = [];
    
    validateEmail(email: string): boolean {
      if (!email) {
        return true; // Consider email field valid if empty (adjust if needed)
      }
      const emailRegex = /^\S+@\S+\.\S+$/; 
      return emailRegex.test(email);
    }
    

    noemail=false;
    noform=false;
    nopwd=false;
    login=false;
  
    onSubmit(): void {
        console.log('Form submitted');
        const rawform = this.form.getRawValue();
        const email = rawform.email.trim();
        this.isLoginInProgress = true;
        this.errorMessage = null;
        this.authService
          .login(email, rawform.password.trim())
          .subscribe({
            next: (response) => {
              console.log(response!.user!.uid);
              const accessToken = response!.user!.accessToken;
              const user_uid = response!.user!.uid;
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('user_uid', user_uid);
              this.router.navigateByUrl('/');
              window.location.reload();
              this.isLoginInProgress = false;
            },
            error: (err: any) => {
              this.handleAuthError(err);
              this.isLoginInProgress = false;
            },
          });
        if (!email) {
          this.noemail = true 
  
          this.noform=false
          // Email not entered
        } 
        if (!this.validateEmail(email)) {
          this.noemail=false
          this.nopwd=false
          this.noform=true 
          // Invalid email format
        }
        else
        {
          
          this.noform=false
        }
  
        
        const mdp=rawform.password.trim();
        if(!mdp ) 
          {
            this.nopwd=true
          }  
    }
  
    handleAuthError(err: any): void {
      console.error('Authentication Error:', err); 
      const rawform = this.form.getRawValue();// Log the error object for inspection
      const email = rawform.email.trim();
      switch (err.code) {
        case 'auth/invalid-credential':
          this.errorMessage = 'Mot de passe ou Email invalide';
          this.nopwd=false
          this.noemail=false
          this.noform=false
          break;
        case 'auth/invalid-email' :
          if (email)
            {
              this.nopwd=false
              
            }
          break;
        case this.validateEmail(email)  :
          this.noform=false
          this.noemail=false
          break; 
      }
  
    }
  
    isLoggedIn(): boolean {
      const hasAccessToken = localStorage.getItem('accessToken') !== null;
      
      timer(1000);
      if (hasAccessToken) {
        return true;
      } else {     
        return false;
      }
    }
   
    
}