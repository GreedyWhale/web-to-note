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

    const contentWrap = document.createElement('div');
    contentWrap.appendChild(selectedDom);
    const htmlString = contentWrap.innerHTML;

    return htmlString;
  }
};

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
