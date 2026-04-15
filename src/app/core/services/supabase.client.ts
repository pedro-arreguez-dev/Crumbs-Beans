import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Workaround for NavigatorLockAcquireTimeoutError in Angular
      lock: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (name: string, acquireTimeout: number, callback: () => any) => callback(),
    },
  }
);

export function getProductImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const { data } = supabase.storage.from('images').getPublicUrl(`products/${path}`);
  return data.publicUrl;
}
