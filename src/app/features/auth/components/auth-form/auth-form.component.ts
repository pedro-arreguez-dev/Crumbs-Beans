import { Component, Output, EventEmitter, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  standalone: true
})
export class AuthFormComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Input() errorMessage: string | null = null;
  @Output() submitLogin = new EventEmitter<{
    email: string;
    password: string;
  }>();

  authForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private fb: FormBuilder, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.authForm.value;

    this.submitLogin.emit({ email: email!, password: password! });
  }

  toggleMode() {
    if (this.mode === 'login') {
      this.router.navigate(['/auth/register']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
