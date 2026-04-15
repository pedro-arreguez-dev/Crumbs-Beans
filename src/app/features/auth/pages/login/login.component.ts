import { Component, signal } from '@angular/core';
import { AuthFormComponent } from "../../components/auth-form/auth-form.component";
import { AuthService } from '@app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  error = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  async handleLogin(credentials: { email: string; password: string }) {
    try {
      this.error.set(null);

      await this.authService.login(
        credentials.email,
        credentials.password
      );

      this.router.navigate(['/']);
    } catch {
      this.error.set('Credenciales inválidas');
    }
  }

}
