import { Injectable, inject, signal } from "@angular/core";
import { getAuth, Auth, browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { UserInterface } from "../app/auth.interface";
import { deleteDoc, doc, getFirestore } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<UserInterface | null | undefined>(undefined);

    register(email: string, username: string, password: string): Observable<any> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(async (response) => {
                await updateProfile(response.user, { displayName: username });
                console.log(response);
            }).catch((error) => {
                console.error('Error creating user:', error);
            });

        return from(promise);
    }

    login(email: string, password: string): Observable<any> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
          .then(response => {
            console.log('Login successful:', response);
            return response; // Return the user object on success
          })
          .catch(error => {
            console.error('Login error:', error);
            return { error }; // Return an error object on failure
          });
      
        return from(promise);
      }
      

    async logout() {
        await this.firebaseAuth.signOut();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user_uid');
    }
}
