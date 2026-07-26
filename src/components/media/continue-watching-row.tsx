'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useHistoryStore } from '@/store/history-store';
import { getPosterUrl } from '@/services/tmdb/images';
import { staggerContainerVariants, staggerItemVariants } from '@/styles/animations';

export function ContinueWatchingRow() {
  const router = useRouter();
  const { getContinueWatching, removeFromHistory } = useHistoryStore();
  const continueWatching = getContinueWatching();

  if (continueWatching.length === 0) {
    return null;
  }

  const handlePlay = (item: any) => {
    if (item.mediaType === 'movie') {
      router.push(`/watch/movie/${item.mediaId}`);
    } else {
      router.push(`/watch/tv/${item.mediaId}/${item.season}/${item.episode}`);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromHistory(id);
  };

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16">
        Continue Watching
      </h2>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16 py-6 md:py-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {continueWatching.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItemVariants}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileFocus={{ scale: 1.08, zIndex: 10 }}
              transition={{ duration: 0.2 }}
              className="group relative cursor-pointer"
              onClick={() => handlePlay(item)}
              tabIndex={0}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                {item.posterPath ? (
                  <Image
                    src={getPosterUrl(item.posterPath) || ''}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white rounded-full p-3">
                    <Play className="w-8 h-8 text-black fill-black" />
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemove(e, item.id)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-black rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Remove from continue watching"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Title and Info */}
              <div className="mt-2">
                <h3 className="text-white font-medium text-sm line-clamp-2">
                  {item.title}
                </h3>
                {item.mediaType === 'tv' && item.episodeName && (
                  <p className="text-gray-400 text-xs mt-1">
                    S{item.season} E{item.episode}: {item.episodeName}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {item.progress}% watched
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
