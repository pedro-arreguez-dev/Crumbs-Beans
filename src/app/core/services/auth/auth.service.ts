import { Injectable, signal, computed } from '@angular/core';
import { supabase } from '../supabase.client';
import { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private initialized = false;
  private userSignal = signal<User | null>(null);

  // Estado publico
  user = computed(() => this.userSignal());

  constructor() {
    this.initAuth();
  }

  // Inicializa sesion
  private async initAuth() {
    const { data } = await supabase.auth.getUser();
    this.userSignal.set(data.user);

    this.initialized = true;

    supabase.auth.onAuthStateChange((_event, session) => {
      this.userSignal.set(session?.user ?? null);
    });
  }

  // Login
  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }

  // Register
  async register(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return data;
  }

  // Logout
  async logout() {
    await supabase.auth.signOut();
    this.userSignal.set(null);
  }

  isAuthenticated() {
    return this.user() !== null;
  }

  async waitForInit() {
    while (!this.initialized) {
      await new Promise(res => setTimeout(res, 20));
    }
  }

  async isAdmin(): Promise<boolean> {
    const user = this.user();

    if (!user) {
      return false;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return false;
    }

    return profile.role === 'admin';
  }
}
