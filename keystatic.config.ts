import { config, fields, collection } from '@keystatic/core';

// 개발 환경에서는 로컬 파일 시스템에 저장하고, 배포 환경에서는 GitHub에 연동하여 저장합니다.
const isDev = process.env.NODE_ENV === 'development';

export default config({
  storage: isDev 
    ? { kind: 'local' } 
    : {
        kind: 'github',
        repo: 'ineco812/family-tax-website', // 실제 깃허브 저장소 연결 완료
      },
  secret: 'daedeb4f1ffee3e447b3824e3dd874a41665f616a8022226b54eee01ebdd4fb1',
  ui: {
    brand: { name: '가족상속세무연구소 CMS' },
    navigation: {
      '콘텐츠 관리': ['posts'],
    },
  },
  collections: {
    posts: collection({
      label: '세무 칼럼',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: '제목 (Title)' } }),
        summary: fields.text({ label: '요약 (Summary)', multiline: true }),
        date: fields.date({ label: '작성일 (Date)', defaultValue: { kind: 'today' } }),
        tags: fields.array(fields.text({ label: '태그 (Tag)' }), { label: '태그 목록', itemLabel: props => props.value }),
        // 이미지 필드 등 추가 가능. 본문 내 이미지 첨부를 위해 아래 content 필드 사용.
        content: fields.markdoc({
          label: '본문 내용',
          extension: 'md',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
        }),
      },
    }),
  },
});
