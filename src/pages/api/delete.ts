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
    const { slug } = data;

    if (!slug) {
      return new Response(JSON.stringify({ message: '삭제할 글의 슬러그가 제공되지 않았습니다.' }), { status: 400 });
    }

    const owner = 'ineco812';
    const repo = 'family-tax-website';
    const path = `src/content/posts/${slug}.md`;
    
    // 1. 파일의 SHA 가져오기
    const getFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-CMS'
      }
    });

    if (!getFileResponse.ok) {
      return new Response(JSON.stringify({ message: '삭제할 파일을 찾을 수 없습니다.' }), { status: 404 });
    }

    const fileData = await getFileResponse.json();
    const fileSha = fileData.sha;

    // 2. 파일 삭제 (DELETE)
    const deleteResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-CMS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `CMS: Delete post "${slug}"`,
        sha: fileSha,
        branch: 'main'
      })
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    return new Response(JSON.stringify({ success: true, message: '성공적으로 삭제되었습니다.' }), {
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
