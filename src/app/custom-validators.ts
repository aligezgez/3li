import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static email(control: AbstractControl<string>): ValidationErrors | null {
    const emailRegex = new RegExp(/^\S+@\S+\.\S+$/);

    if (!control.value) return null;
    return emailRegex.test(control.value) ? null : { email: true };
  }

  static nom(control: AbstractControl<string>): ValidationErrors | null {
    const nameRegex = new RegExp(/^[a-zA-Z\s]+$/);

    if (!control.value) return null;
    return nameRegex.test(control.value) ? null : { name: true };
  }
  static matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { matchPassword: true };
  }
}