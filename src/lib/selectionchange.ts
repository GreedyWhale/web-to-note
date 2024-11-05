import type { Instance as TippyInstance } from 'tippy.js';

import { debounce } from 'radash';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const createTooltip = (mountElement: HTMLElement, position: Record<'x' | 'y', number>) => {
  const instance = tippy(mountElement, {
    allowHTML: true,
    content: 'hello',
    placement: 'bottom-start',
    appendTo: document.body,
    interactive: true,
    hideOnClick: true,
    trigger: "click",
    offset: [position.x, position.y]
  });

  return instance;
};

export const handleSelectionchange = () => {
  let tooltip: TippyInstance;

  const handler = debounce({ delay: 300 }, (event: Event) => {
    console.log(tooltip);
    if (tooltip) {
      tooltip.destroy();
    }
    console.log(tooltip);

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const anchorNode = selection?.anchorNode;

    if (!selectedText) {
      return;
    }

    if (anchorNode) {
      const element = anchorNode.nodeType === Node.ELEMENT_NODE
        ? anchorNode as HTMLElement
        : anchorNode.parentElement;

      if (element) {
        // const { bottom: elementBottom, left: elementLeft } = element.getBoundingClientRect();
        // const { bottom: selectionBottom, left: selectionLeft } = selection.getRangeAt(0).getBoundingClientRect();
        // const x = selectionLeft - elementLeft;
        // const y = Math.abs(selectionBottom - elementBottom) <= 5 ? -15 : Math.abs(selectionBottom - elementBottom + 15);

        // console.log('selection', selectionBottom, selectionLeft);
        // console.log('element', elementBottom, elementLeft);
        // console.log(element)
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        // 获取选区的中心位置
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + window.scrollY - 10; // 上方稍微偏移 10 像素

        console.log(element, centerY,centerX);
        tooltip = createTooltip(element, {x: centerX, y: centerY});
        tooltip.show();
      }
    }
  });

  document.addEventListener('mouseup',handler);

  return () => document.removeEventListener('mouseup',handler);
}