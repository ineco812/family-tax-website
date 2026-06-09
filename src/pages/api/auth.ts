import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { email, password } = data;

    // 하드코딩된 자격 증명 검증
    if (email === 'ineco812@proton.me' && password === 'ineco123!!') {
      // 인증 성공 시 쿠키 설정 (보안 강화를 위해 HttpOnly, Secure 속성 권장)
      cookies.set('admin_session', 'authenticated_user_session_token', {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD, // 배포 환경에서는 HTTPS 필수
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7일 유지
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 인증 실패
    return new Response(JSON.stringify({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '잘못된 요청입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
