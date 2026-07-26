'use client';

import { MediaCarousel } from './media-carousel';
import { SkeletonRow } from './skeleton-card';

interface ContentRowProps {
  title: string;
  items: any[];
  type?: 'movie' | 'tv';
  isLoading?: boolean;
  onItemClick?: (id: number) => void;
}

export function ContentRow({
  title,
  items,
  type = 'movie',
  isLoading = false,
  onItemClick,
}: ContentRowProps) {
  if (isLoading) {
    return <SkeletonRow />;
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-12">
      <MediaCarousel
        items={items}
        title={title}
        type={type}
        onItemClick={onItemClick}
      />
    </div>
  );
}
