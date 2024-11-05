/**
 * @description 在符合 matches 规则的网站上执行，可以访问页面 dom
 */

import { ACTION_GET_SELECTED_DOM } from '~/utils/constants';

type OnMessageRequest = {
  action: typeof ACTION_GET_SELECTED_DOM;
}

const getSelectedDom = (request: OnMessageRequest, sendResponse: (params: unknown) => void) => {
  if (request.action === ACTION_GET_SELECTED_DOM) {
    // 获取选中的 DOM 结构
    const selection = window.getSelection();
    if (!selection) {
      return sendResponse({ error: 'No selection' });
    }

    // 获取选区的 Range 和选区的 DOM 内容
    const range = selection.getRangeAt(0);
    const selectedDom = range.cloneContents();  // 获取选区的内容（节点）

    // 你可以选择将选区的内容转换为 HTML 字符串，或者返回节点等
    const contentWrap = document.createElement('div');
    contentWrap.appendChild(selectedDom);
    const htmlString = contentWrap.innerHTML;

    // 发送选区的 DOM 返回给 background.js
    sendResponse({ html: htmlString });
  }
};

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      getSelectedDom(request, sendResponse);

      return true; // 需要返回 true 来保持消息通道
    });
  },
});
