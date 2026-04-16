import { Component, signal } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AuthFormComponent } from '@app/features/auth/components/auth-form/auth-form.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async handleRegister(credentials: { email: string; password: string }) {
    try {
      this.error.set(null);

      await this.authService.register(credentials.email, credentials.password);

      this.router.navigate(['/']);
    } catch {
      this.error.set('Credenciales inválidas');
    }
  }
}
