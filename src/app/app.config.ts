import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore } from 'firebase/firestore';
import { provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import routeConfig from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';

const firebaseConfig = {
  apiKey: "AIzaSyBqQo-r1JjNhMiGXU9TuIIhd4QlO4dbXjc",
  authDomain: "cairusbc.firebaseapp.com",
  databaseURL: "https://cairusbc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cairusbc",
  storageBucket: "cairusbc.appspot.com",
  messagingSenderId: "65055148934",
  appId: "1:65055148934:web:c2b1a4e8c87c800bf73a07"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};