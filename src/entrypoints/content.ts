/**
 * @description 在符合 matches 规则的网站上执行，可以访问页面 dom
 */

import { ACTION_GET_SELECTED_DOM } from '~/utils/constants';

type OnMessageRequest = {
  action: typeof ACTION_GET_SELECTED_DOM;
}

const getSelectedHtml = (request: OnMessageRequest) => {
  if (request.action === ACTION_GET_SELECTED_DOM) {
    // 获取选中的 DOM 结构
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    // 获取选区的 Range 和选区的 DOM 内容
    const range = selection.getRangeAt(0);
    const selectedDom = range.cloneContents();  // 获取选区的内容（节点）
    const filteredDOM = filterDom(selectedDom);
    const extractedContents = extractContentsWithRules(filteredDOM);

    return extractedContents;
  }
};

const filterDom = (fragment: DocumentFragment) => {
  /**
   * 需要过滤的元素：
   * head、script、style、form、input、textarea、button、canvas、video、iframe
   * 含有 contenteditable 属性的元素
   */
  const elements = [
    fragment.querySelectorAll('head'),
    fragment.querySelectorAll('script'),
    fragment.querySelectorAll('style'),
    fragment.querySelectorAll('form'),
    fragment.querySelectorAll('input'),
    fragment.querySelectorAll('textarea'),
    fragment.querySelectorAll('button'),
    fragment.querySelectorAll('canvas'),
    fragment.querySelectorAll('video'),
    fragment.querySelectorAll('iframe'),
    fragment.querySelectorAll('[contenteditable]')
  ];

  for (const items of elements) {
    for (const element of items) {
      element.remove();
    }
  }

  return fragment;
};

const extractContentsWithRules = (node: Node) => {
  const allowedTags = new Set(['IMG', 'TABLE', 'CODE']);
  const result = [];
  const stack = [node];

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode) {
      // 如果当前节点是文本节点，添加到结果中
      if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent?.trim()) {
        result.push(currentNode.textContent.trim());
      }

      const _currentNode = currentNode as HTMLElement;
      if (currentNode.nodeType === Node.ELEMENT_NODE && allowedTags.has(_currentNode.tagName)) {
        result.push(_currentNode.outerHTML);
      } else if (currentNode.childNodes) {
        // 将子节点按顺序压入堆栈
        for (let i = currentNode.childNodes.length - 1; i >= 0; i--) {
          stack.push(currentNode.childNodes[i]);
        }
      }
    }
  }

  return result.join('\n');
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const htmlString = getSelectedHtml(request);
      if (htmlString) {
        sendResponse({ html: htmlString });
      } else {
        sendResponse({ error: 'No selection' })
      }
    });
  },
});
