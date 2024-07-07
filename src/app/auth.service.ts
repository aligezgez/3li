import { Injectable, inject, signal } from "@angular/core";
import { Auth,  createUserWithEmailAndPassword,  signInWithEmailAndPassword, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { UserInterface } from "../app/auth.interface";


@Injectable({
    providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  async register(email: string, username: string, password: string) {
    console.log('Registering user:', email, username);
try {
   const freshAccount = await createUserWithEmailAndPassword(this.firebaseAuth, email, password)
   return updateProfile(freshAccount.user, {displayName: username});
 }
 catch(error: any) {
  console.error('Error creating user:', error);
  }
}

  
  async login(email: string, password: string): Promise<Observable<any>> {
    console.log('Logging in user:', email);
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        console.log('Login successful:', response);
        return response;
      })
      .catch(error => {
        console.error('Login error:', error);
        throw error; 
      });
  
    return from(promise);
  }
  
  
    

  async logout() {
      await this.firebaseAuth.signOut();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user_uid');
  }
}