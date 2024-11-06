import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: 'Web to notes',
    description: 'Export web content to notes',
    permissions: ['contextMenus', 'nativeMessaging']
  }
});
