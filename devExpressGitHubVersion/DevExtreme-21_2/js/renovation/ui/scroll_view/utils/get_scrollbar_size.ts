import { ScrollableDirection } from '../common/types.d';

export function getScrollbarSize(element: HTMLElement, direction: Omit<ScrollableDirection, 'horizontal' | 'vertical'>): number {
  if (direction === 'vertical') {
    return element.offsetWidth - element.clientWidth;
  }

  return element.offsetHeight - element.clientHeight;
}
