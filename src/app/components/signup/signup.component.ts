import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { collection, getDocs, getFirestore, query, where, addDoc } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [HeaderComponent,CommonModule,ReactiveFormsModule,AngularFireStorageModule]
})
export class SignupComponent implements OnInit {

  focusedField: string | null = null;
  signupForm: any;
  userExists = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private formBuilder: FormBuilder,private authservice:AuthService) {}

  ngOnInit(): void {
      this.signupForm = this.formBuilder.group({
          name: ['', [Validators.required,Validators.pattern(/^[a-zA-Z\s]+$/)]],
          email: ['', [Validators.required, Validators.pattern('[^@]+@[^@]+\\.[a-zA-Z]{2,6}')]],
          password: ['', Validators.required],
          confirmPassword: ['', Validators.required]
    }, {
        validator: this.passwordMatchValidator 
    });
      
  }
  markAllAsTouched(): void {
    this.signupForm.markAllAsTouched();
  }


  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid) {
      this.markAllAsTouched();
      return;
    }
      if (this.signupForm.valid) {
          const name = this.signupForm.get('name')!.value;
          const email = this.signupForm.get('email')!.value;
          const password = this.signupForm.get('password')!.value;

          const userExists = await this.checkIfUserExists(email);

          if (userExists) {
              this.userExists = true;
          } else {
              this.userExists = false;
              await this.addNewUser(name, email, password);
              await this.registeruser(name, email, password);
              this.signupForm.reset();            
          }
      } 
  }
  
  onFocus(fieldName: string): void {
    this.focusedField = fieldName;
    
  }

  onBlur(fieldName: string): void {
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
  
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
  
    if (password !== confirmPassword) {
      console.log('Passwords do not match!'); 
      formGroup.get('confirmPassword')!.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  
  
  
}
