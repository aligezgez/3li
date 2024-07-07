import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, getDocs, getFirestore, query, where, addDoc } from 'firebase/firestore';
import { CustomValidators } from '../../custom-validators';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
interface User {
  id: string;
  email: string;
  name: string;
  pwd:string;
  [key: string]: any; // Add other properties as needed
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [HeaderComponent,CommonModule,ReactiveFormsModule]
})
export class SignupComponent implements OnInit {
  isLoggedIn: boolean;
  user: any;
  response: { user?: User } = {};
  errorMessage: string | null = null;
  noname=false;
  nopwd=false;
  nomail=false;
  userexist=false;
  signupForm: any;
 
  constructor(private location: Location, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,private authservice:AuthService) {
    this.user = localStorage.getItem('user_uid');
    this.isLoggedIn = !!this.user;
    this.signupForm = new FormGroup({
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, CustomValidators.email] }),
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, CustomValidators.nom] }),
      password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      confirmpassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, CustomValidators.matchPassword] }),
    });
    
  }
  

  ngOnInit():void {}

  
  async onSubmit(): Promise<void> {
    if (this.signupForm.valid) {
      const name = this.signupForm.get('name')!.value;
      const email = this.signupForm.get('email')!.value;
      const password = this.signupForm.get('password')!.value;
      const confirmpassword = this.signupForm.get('confirmpassword')!.value;
      this.nomail=true;
      this.noname=true;
      this.nopwd=true;
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Confirm Password:', confirmpassword);

      // Check if the user already exists
      const userExists = await this.checkIfUserExists(email);
      if (userExists) {
        this.errorMessage = 'User already exists. Please use a different email.';
        this.userexist=true;
      } else {
        this.errorMessage = null;
        
        await this.addNewUser(name, email, password);
        await this.registeruser(name, email, password);
        this.router.navigate(['/dashboard']); 
      }
    } else {
      console.log('Form is invalid');
    }
  }
  

  async checkIfUserExists(email: string): Promise<boolean> {
    const db = getFirestore();
    const bundleRef = collection(db, "users");
    const q1 = query(bundleRef, where("email", "==", email));
    const nompr1 = await getDocs(q1);

    return !nompr1.empty;
  }

  async addNewUser(name: string, email: string, password: string): Promise<void> {
    const db = getFirestore();
    await addDoc(collection(db, "users"), { name, email, password });
    console.log('User added successfully');
  }

  async registeruser(name: string, email: string, password: string): Promise<void> {
    try {
      await (await this.authservice.register(email, name, password)); 
      console.log('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
}
