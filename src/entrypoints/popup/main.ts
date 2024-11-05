/**
 * @description 扩展的弹出窗口
 */

import './app.css';
import App from './App.svelte';

const app = new App({
  // biome-ignore lint/style/noNonNullAssertion: 该元素一定存在
  target: document.getElementById('app')!,
});

export default app;
