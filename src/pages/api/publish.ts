import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  // 인증 확인
  if (!cookies.has('admin_session')) {
    return new Response(JSON.stringify({ message: '인증되지 않은 사용자입니다.' }), { status: 401 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ 
      message: '서버에 GITHUB_TOKEN이 설정되어 있지 않습니다. Netlify 환경 변수에 GitHub Personal Access Token을 추가해주세요.' 
    }), { status: 500 });
  }

  try {
    const data = await request.json();
    const { title, slug, summary, tags, content } = data;

    if (!title || !slug || !content) {
      return new Response(JSON.stringify({ message: '필수 항목이 누락되었습니다.' }), { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Markdown Frontmatter 생성
    const frontmatter = `---
title: '${title.replace(/'/g, "''")}'
summary: '${summary ? summary.replace(/'/g, "''") : ''}'
date: ${today}
tags: ${tags && tags.length > 0 ? '\n  - ' + tags.join('\n  - ') : '[]'}
---

${content}
`;

    // 깃허브 API 호출 정보
    const owner = 'ineco812';
    const repo = 'family-tax-website';
    const path = `src/content/posts/${slug}.md`;
    
    // 파일이 이미 존재하는지 확인하여 SHA 가져오기 (수정 지원)
    let fileSha = undefined;
    const getFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-CMS'
      }
    });

    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      fileSha = fileData.sha;
    }

    // 파일 생성 또는 업데이트
    const contentEncoded = Buffer.from(frontmatter, 'utf-8').toString('base64');
    
    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-CMS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `CMS: ${fileSha ? 'Update' : 'Create'} post "${title}"`,
        content: contentEncoded,
        sha: fileSha,
        branch: 'main'
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    return new Response(JSON.stringify({ success: true, message: '성공적으로 커밋되었습니다.' }), {
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
