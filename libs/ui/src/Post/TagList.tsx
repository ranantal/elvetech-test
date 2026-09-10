/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Chip, Link } from '@mui/material';

export interface TagListProps {
  tags: string[];
}

const CHIP_GAP = 4;

const containerStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const collapsedStyles = css`
  flex-wrap: nowrap;
  overflow: hidden;
`;

const expandedStyles = css`
  flex-wrap: wrap;
  overflow: visible;
`;

const measureStyles = css`
  position: absolute;
  visibility: hidden;
  display: flex;
  gap: 4px;
  pointer-events: none;
`;

// Matches MUI Chip's default label typography (.MuiChip-label).
// !important: MUI's Link ships its own typography styles via emotion,
// which otherwise win the cascade over this plain css-prop style.
const tagFontStyles = css`
  white-space: nowrap !important;
  font-size: 0.8125rem !important;
  font-weight: 400 !important;
  font-family: Roboto, Helvetica, Arial, sans-serif !important;
`;

export function TagList({ tags }: TagListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const moreRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || tags.length === 0) {
      return;
    }

    const containerWidth = container.clientWidth;
    const chipWidths = measureRefs.current.map((el) => el?.offsetWidth ?? 0);
    const moreWidth = moreRef.current?.offsetWidth ?? 0;

    const totalWidth = chipWidths.reduce(
      (sum, width, index) => sum + width + (index > 0 ? CHIP_GAP : 0),
      0,
    );

    if (totalWidth <= containerWidth) {
      setVisibleCount(tags.length);
      return;
    }

    let usedWidth = 0;
    let count = 0;
    for (let i = 0; i < chipWidths.length; i++) {
      const gap = i > 0 ? CHIP_GAP : 0;
      const widthWithChip = usedWidth + gap + chipWidths[i];
      if (widthWithChip + CHIP_GAP + moreWidth > containerWidth) {
        break;
      }
      usedWidth = widthWithChip;
      count = i + 1;
    }

    setVisibleCount(Math.max(count, 1));
  }, [tags]);

  const hasOverflow = visibleCount < tags.length;
  const shownTags = expanded ? tags : tags.slice(0, visibleCount);

  return (
    <Box
      ref={containerRef}
      css={[containerStyles, expanded ? expandedStyles : collapsedStyles]}
    >
      {/* Invisible measurement pass: same chips laid out on one line so we
          can read their real rendered widths before deciding how many to
          actually show. */}
      <Box css={measureStyles}>
        {tags.map((tag, index) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            ref={(el) => {
              measureRefs.current[index] = el;
            }}
          />
        ))}
        <Box component="span" ref={moreRef} css={tagFontStyles}>
          ... show more
        </Box>
      </Box>

      {shownTags.map((tag) => (
        <Chip key={tag} label={tag} size="small" />
      ))}
      {!expanded && hasOverflow && (
        <Link
          component="button"
          type="button"
          onClick={() => setExpanded(true)}
          css={tagFontStyles}
        >
          ... show more
        </Link>
      )}
      {expanded && hasOverflow && (
        <Link
          component="button"
          type="button"
          onClick={() => setExpanded(false)}
          css={tagFontStyles}
        >
          show less
        </Link>
      )}
    </Box>
  );
}

export default TagList;
