import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore } from 'firebase/firestore';
import { provideFirestore, getFirestore as getFirestore_alias } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import routeConfig from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getDatabase, provideDatabase } from '@angular/fire/database';



const firebaseConfig = {
  apiKey: "AIzaSyD9Tpq9T_gl8tpuCdpTPKIrS0cfBTwhAQE",
  authDomain: "convo-310a6.firebaseapp.com",
  databaseURL: "https://convo-310a6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "convo-310a6",
  storageBucket: "convo-310a6.appspot.com",
  messagingSenderId: "762195961453",
  appId: "1:762195961453:web:6bf922d2b6e7b6d7f44164",
  measurementId: "G-0LR343DP4N"
};




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()), 
    provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"convo-310a6","appId":"1:762195961453:web:6bf922d2b6e7b6d7f44164","databaseURL":"https://convo-310a6-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"convo-310a6.appspot.com","apiKey":"AIzaSyD9Tpq9T_gl8tpuCdpTPKIrS0cfBTwhAQE","authDomain":"convo-310a6.firebaseapp.com","messagingSenderId":"762195961453","measurementId":"G-0LR343DP4N"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()),
  ],
};



