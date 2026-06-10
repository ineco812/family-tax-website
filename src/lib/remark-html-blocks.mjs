import { visit } from 'unist-util-visit';

export default function remarkHtmlBlocks() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      // 언어(lang)가 지정되지 않은 코드 블록 (즉, 들여쓰기로 생성된 코드 블록)
      if (!node.lang) {
        // 내부 텍스트가 HTML 태그로 시작하거나 끝나는 경우
        if (/<[a-zA-Z\/][\s\S]*>/.test(node.value)) {
          // 해당 블록을 'html' 노드로 변환
          node.type = 'html';
        }
      }
    });
  };
}
