import React, { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { generateItemSvg } from '../lib/visuals';

/**
 * Renders an authentic polar photograph/visual with video indicator and deterministic SVG fallback.
 */
export default function ItemVisual({ item, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    sm: { width: 320, height: 200 },
    md: { width: 560, height: 350 },
    lg: { width: 800, height: 500 },
  };

  const { width, height } = dimensions[size] || dimensions.md;

  const svgContent = useMemo(() => {
    return generateItemSvg(item, width, height);
  }, [item?.id, item?.visualSeed, item?.type, width, height]);

  const hasImage = Boolean(item?.imageUrl) && !imageError;
  const isVideo = item?.type === 'Video';

  return (
    <div
      className={`relative overflow-hidden bg-polar-950 flex items-center justify-center select-none ${className}`}
      aria-label={`Polar visual for ${item?.title || 'item'}`}
    >
      {hasImage ? (
        <img
          src={item.imageUrl}
          alt={item.title || 'Polar science record photograph'}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}

      {/* Video Play Badge Overlay */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-polar-950/20 group-hover:bg-polar-950/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-polar-950/70 backdrop-blur-md border border-white/30 text-glacier-50 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 ml-0.5 fill-aurora-400 text-aurora-400" />
          </div>
        </div>
      )}
    </div>
  );
}
