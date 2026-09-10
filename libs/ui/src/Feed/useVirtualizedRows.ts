import { useRef, type RefObject } from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';

export interface UseVirtualizedRowsResult {
  scrollRef: RefObject<HTMLDivElement | null>;
  totalSize: number;
  virtualRows: VirtualItem[];
  measureElement: (node: Element | null) => void;
}

// Isolates "how to virtualize a scrollable list of rows" from whatever a
// caller renders for each row — Feed only deals with what a row shows.
export function useVirtualizedRows(
  count: number,
  estimateRowSize: number,
): UseVirtualizedRowsResult {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowSize,
  });

  return {
    scrollRef,
    totalSize: virtualizer.getTotalSize(),
    virtualRows: virtualizer.getVirtualItems(),
    measureElement: virtualizer.measureElement,
  };
}
