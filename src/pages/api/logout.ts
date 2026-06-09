import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  if (cookies.has('admin_session')) {
    cookies.delete('admin_session', { path: '/' });
  }
  return redirect('/login');
}
