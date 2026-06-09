import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('posts');
  return rss({
    title: '가족상속세무연구소 - 상속세 및 증여세 전문 절세 칼럼',
    description: '복잡하고 어려운 상속세와 증여세, 전문가의 명확한 진단과 체계적인 절세 솔루션을 통해 가족의 안정적인 미래를 준비하세요.',
    site: context.site || 'https://preeminent-pastelito-8d7f42.netlify.app',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>ko-kr</language>`,
  });
}
