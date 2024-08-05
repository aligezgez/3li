import { Injectable, inject, signal } from "@angular/core";
import { Auth,  createUserWithEmailAndPassword,  signInWithEmailAndPassword, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { User } from "./user.interface";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<User | null | undefined>(undefined);
  router=inject(Router);
  private username: string | null = null;
  private token: string | null = null;
  
  async register(email: string, username: string, password: string) {
    console.log('Registering user:', email, username);
    try {
      const freshAccount = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      await updateProfile(freshAccount.user, { displayName: username });
      localStorage.setItem('username', username);
      console.log('Username saved to localStorage:', localStorage.getItem('username'));
      
    }
    catch(error: any) {
      console.error('Error creating user:', error);
      }
}

  
async login(email: string, password: string): Promise<Observable<any>> {
  console.log('Logging in user:', email);
  const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(async response => {
          console.log('Login successful:', response);
          const user = response.user;
          const username = user.displayName;
          if (username) {
              localStorage.setItem('username', username);
              console.log('Username saved to localStorage:', username);
          } else {
              await user.reload();
              const updatedUser = this.firebaseAuth.currentUser;
              const updatedUsername = updatedUser ? updatedUser.displayName : null;
              if (updatedUsername) {
                  localStorage.setItem('username', updatedUsername);
                  console.log('Updated username saved to localStorage:', updatedUsername);
              }
          }
          return response;
      })
      .catch(error => {
          console.error('Login error:', error);
          throw error;
      });

  return from(promise);
}

  
getUsername() {
  if (typeof localStorage !== 'undefined') {
      const username = this.username || localStorage.getItem('username');
      console.log('Retrieved username:', username);
      return username;
  } else {
      console.log('localStorage is not available');
      return null;
  }
}

    

async logout() {
  await this.firebaseAuth.signOut();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user_uid');
  localStorage.removeItem('username');
  this.username = null;
  this.token = null;
}

}