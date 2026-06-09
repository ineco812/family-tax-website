import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  // 인증 확인
  if (!cookies.has('admin_session')) {
    return new Response(JSON.stringify({ message: '인증되지 않은 사용자입니다.' }), { status: 401 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ 
      message: '서버에 GITHUB_TOKEN이 설정되어 있지 않습니다.' 
    }), { status: 500 });
  }

  try {
    const data = await request.json();
    const { filename, content } = data;

    if (!filename || !content) {
      return new Response(JSON.stringify({ message: '파일 정보가 없습니다.' }), { status: 400 });
    }

    // 파일 이름에 타임스탬프를 붙여 중복 방지 (공백은 하이픈으로 변경)
    const safeFilename = filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueFilename = `${Date.now()}-${safeFilename}`;
    const path = `public/images/posts/${uniqueFilename}`;
    
    // 깃허브 API 호출 정보
    const owner = 'ineco812';
    const repo = 'family-tax-website';
    
    // 파일 생성 (Base64 컨텐츠 업로드)
    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-CMS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `CMS: Upload image "${uniqueFilename}"`,
        content: content, // 이미 프론트엔드에서 콤마 뒷부분(Base64)만 보냄
        branch: 'main'
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    // 마크다운에서 사용할 퍼블릭 URL 반환 (/images/posts/...)
    return new Response(JSON.stringify({ 
      success: true, 
      url: `/images/posts/${uniqueFilename}` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message || '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
