import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection , CollectionReference } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, userConverter } from '../../user.interface'

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private firestore: Firestore = inject(Firestore);
  private sidebarVisibilitySubject = new BehaviorSubject<boolean>(true);
  sidebarVisibility$ = this.sidebarVisibilitySubject.asObservable();
  private userCollection: CollectionReference<User>;

  constructor() {
    this.userCollection = collection(this.firestore, 'users').withConverter(userConverter);
  }

  
  getUsers(): Observable<User[]> {
    return collectionData(this.userCollection);
  }
  
  toggleSidebar() {
    this.sidebarVisibilitySubject.next(!this.sidebarVisibilitySubject.value);
  }

}