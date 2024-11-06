import { ACTION_GET_SELECTED_DOM, MENU_ID } from '~/utils/constants';

const createContextMenu = () => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: '剪藏',
    type: 'normal',
    contexts: ['selection']
  });
}

const sendMessage = (message: string) => {
  chrome.runtime.sendNativeMessage(
    'com.google.chrome.demo',
    { message },
    (response) => console.log('Received', response)
  )
}

const handleMenuClick = async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === MENU_ID && tab?.id) {
    const response = await chrome.tabs.sendMessage(tab.id, { action: ACTION_GET_SELECTED_DOM }).catch((error) => ({ error }));
    if (response.html) {
      sendMessage(response.html);
      return;
    }

    console.log(response);
  }
}


export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(createContextMenu);
  chrome.contextMenus.onClicked.addListener(handleMenuClick);
});
