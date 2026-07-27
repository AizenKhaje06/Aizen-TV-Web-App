'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Calendar, Tv, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RatingBadge } from '@/components/media/rating-badge';
import { GenreBadge } from '@/components/media/genre-badge';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { fadeInUpVariants } from '@/styles/animations';
import { useAnimeDetails, useGroupedAnime } from '@/hooks/anilist/use-anime';
import { useUserStore } from '@/store/user-store';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';
import { getCachedTMDBMatch, getSeasonEpisodes, TMDBEpisodeDetails } from '@/services/anime/tmdb-matcher';
import { getBackdropUrl } from '@/services/tmdb/images';

export default function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const animeId = parseInt(resolvedParams.id);
  const padding = useResponsivePadding();
  
  const { data: anime, isLoading, error, refetch } = useAnimeDetails(animeId);
  const { data: groupedAnime } = useGroupedAnime(animeId);
  
  const [selectedEpisode, setSelectedEpisode] = React.useState(1);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = React.useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [episodeDetails, setEpisodeDetails] = React.useState<Map<number, TMDBEpisodeDetails>>(new Map());
  const [loadingThumbnails, setLoadingThumbnails] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const isFavorite = useUserStore((state) => state.isFavorite(animeId));
  const addFavorite = useUserStore((state) => state.addFavorite);
  const removeFavorite = useUserStore((state) => state.removeFavorite);

  // Get current season info (with safe fallbacks for loading state)
  const currentSeason = groupedAnime?.seasons[selectedSeasonIndex];
  const currentSeasonAnime = currentSeason?.anime;
  const currentSeasonId = currentSeasonAnime?.id || animeId;
  const currentSeasonEpisodes = currentSeason?.episodeCount || anime?.episodes || 0;
  const hasSeasons = (groupedAnime?.seasons.length || 0) > 1;
  const isMovie = anime?.format === 'MOVIE';
  const isSeries = (groupedAnime?.seasons.length || 0) > 0 || (!isMovie && anime?.episodes && anime.episodes > 0);

  // Fetch TMDB thumbnails when anime or season changes
  React.useEffect(() => {
    async function fetchThumbnails() {
      if (!anime || !currentSeasonAnime) return;

      setLoadingThumbnails(true);
      try {
        // Get anime title (prefer English, fallback to Romaji)
        const animeTitle = currentSeasonAnime.title.english || currentSeasonAnime.title.romaji || currentSeasonAnime.title.native || '';
        const animeYear = currentSeasonAnime.seasonYear;

        // Try to match with TMDB
        const tmdbMatch = await getCachedTMDBMatch(animeTitle, animeYear);

        if (tmdbMatch && tmdbMatch.confidence !== 'low') {
          // Fetch full episode details from TMDB (thumbnails + metadata)
          // Most anime = Season 1 in TMDB
          const episodes = await getSeasonEpisodes(tmdbMatch.tmdbId, 1);
          setEpisodeDetails(episodes);
          
          console.log(`✅ TMDB Match found for "${animeTitle}":`, tmdbMatch.name, `(${episodes.size} episodes with details)`);
        } else {
          setEpisodeDetails(new Map());
          console.log(`❌ No TMDB match found for "${animeTitle}"`);
        }
      } catch (error) {
        console.error('Error fetching TMDB episode details:', error);
        setEpisodeDetails(new Map());
      } finally {
        setLoadingThumbnails(false);
      }
    }

    fetchThumbnails();
  }, [anime, currentSeasonAnime, selectedSeasonIndex]);

  const handlePlay = () => {
    // Determine if movie or series
    if (anime?.format === 'MOVIE') {
      // For anime movies, play directly using the simple route
      router.push(`/watch/anime/${animeId}`);
    } else {
      // For series, play the first episode by default
      router.push(`/watch/anime/${animeId}/1`);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(animeId);
    } else if (anime) {
      addFavorite({
        id: anime.id,
        type: anime.format === 'MOVIE' ? 'movie' : 'tv',
        title: anime.title?.english || anime.title?.romaji || anime.title?.native || '',
        posterPath: anime.coverImage?.extraLarge || anime.coverImage?.large || null,
        backdropPath: anime.bannerImage || null,
        addedAt: Date.now(),
      });
    }
  };

  if (isLoading || !anime) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AppShell>
        <ApiError
          error={error as Error}
          message="Failed to load anime details"
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const title = anime.title?.english || anime.title?.romaji || anime.title?.native || '';
  const description = anime.description?.replace(/<[^>]*>/g, '') || '';

  return (
    <AppShell>
      {/* Combined Hero Banner Section */}
      <div className="relative w-full min-h-screen">
        {/* Backdrop Image */}
        {anime.bannerImage && (
          <Image
            src={anime.bannerImage}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* All Hero Content */}
        <div 
          className="relative z-10 pt-20 md:pt-24 pb-12 md:pb-16 space-y-6"
          style={{ paddingLeft: padding.left, paddingRight: padding.right }}
        >
          {/* Title */}
          <motion.h1
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white max-w-4xl mb-6"
          >
            {title}
          </motion.h1>

          {/* Metadata */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-4 mb-2"
          >
            {anime.averageScore && (
              <RatingBadge rating={anime.averageScore / 10} size="lg" />
            )}
            {anime.seasonYear && (
              <span className="text-gray-200 text-lg font-medium">
                {anime.seasonYear}
              </span>
            )}
            {anime.format && (
              <span className="text-gray-200 text-lg font-medium">
                {anime.format.replace('_', ' ')}
              </span>
            )}
            {anime.episodes && (
              <span className="text-gray-200 text-lg flex items-center gap-1">
                <Tv className="w-4 h-4" />
                {anime.episodes} Episodes
              </span>
            )}
            {anime.popularity && (
              <span className="text-gray-200 text-lg flex items-center gap-1">
                <Users className="w-4 h-4" />
                {anime.popularity.toLocaleString()} fans
              </span>
            )}
          </motion.div>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mb-4"
            >
              {anime.genres.map((genre: string) => (
                <GenreBadge key={genre} genre={genre} />
              ))}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={handlePlay}
              className="flex items-center gap-3 px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold text-lg hover:bg-yellow-400 focus:bg-yellow-400 focus:scale-105 transition-all focus:ring-4 focus:ring-yellow-500/50 focus:outline-none"
            >
              <Play className="w-6 h-6 fill-current" />
              Play
            </button>
            <button
              onClick={toggleFavorite}
              className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg font-bold text-lg hover:bg-white/30 focus:bg-white/30 focus:scale-105 transition-all focus:ring-4 focus:ring-white/50 focus:outline-none"
            >
              {isFavorite ? (
                <>
                  <Check className="w-6 h-6" />
                  In My List
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Add to List
                </>
              )}
            </button>
          </motion.div>

          {/* Synopsis */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 max-w-4xl"
            style={{ marginTop: '37px' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">Synopsis</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Anime Info Grid - Compact Single Line */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-start gap-x-6 gap-y-2 max-w-[50vw]"
            style={{ marginTop: '37px' }}
          >
            {anime.studios && anime.studios.nodes && anime.studios.nodes.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Studio</h3>
                <p className="text-xs text-white font-medium line-clamp-1">{anime.studios.nodes[0].name}</p>
              </div>
            )}
            
            {anime.status && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Status</h3>
                <p className="text-xs text-white font-medium">{anime.status.replace('_', ' ')}</p>
              </div>
            )}

            {anime.source && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Source</h3>
                <p className="text-xs text-white font-medium">{anime.source.replace('_', ' ')}</p>
              </div>
            )}

            {anime.season && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Season</h3>
                <p className="text-xs text-white font-medium">{anime.season} {anime.seasonYear}</p>
              </div>
            )}

            {anime.duration && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Duration</h3>
                <p className="text-xs text-white font-medium">{anime.duration} min</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Anime Details */}
      <motion.section
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-8 md:py-12"
        style={{ paddingLeft: padding.left, paddingRight: padding.right }}
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">{isMovie ? 'Movie' : 'Anime'} Details</h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
              {anime.startDate && anime.startDate.year && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Air Date</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {anime.startDate.month}/{anime.startDate.day}/{anime.startDate.year}
                  </p>
                </div>
              )}
              {anime.averageScore && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {(anime.averageScore / 10).toFixed(1)}/10 ({anime.favourites?.toLocaleString()} favorites)
                  </p>
                </div>
              )}
              {anime.episodes && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Total Episodes</p>
                  <p className="text-sm text-white">
                    {anime.episodes} Episodes
                  </p>
                </div>
              )}
              {anime.duration && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Episode Duration</p>
                  <p className="text-sm text-white">
                    {anime.duration} min
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Episodes Section - With Season Selector */}
      {isSeries && (
        <motion.section
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 md:py-12"
          style={{ paddingLeft: padding.left, paddingRight: padding.right }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Episodes</h2>
              
              {/* Season Selector Dropdown (only if multiple seasons) */}
              {hasSeasons && groupedAnime && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between min-w-[240px] bg-gray-700/90 text-white rounded-lg px-5 py-3 text-base font-semibold hover:bg-gray-600/90 transition-colors border border-gray-600"
                  >
                    <span>Season {groupedAnime.seasons[selectedSeasonIndex].seasonNumber}</span>
                    <svg className="w-5 h-5 text-white ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 min-w-[240px] bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl z-50 overflow-hidden">
                      {groupedAnime.seasons.map((season, index) => {
                        const seasonTitle = season.anime.title.english || season.anime.title.romaji || season.anime.title.native;
                        return (
                          <button
                            key={season.anime.id}
                            onClick={() => {
                              setSelectedSeasonIndex(index);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 transition-colors ${
                              selectedSeasonIndex === index
                                ? 'bg-red-600 text-white font-bold'
                                : 'text-gray-300 hover:bg-gray-700/80'
                            }`}
                          >
                            <div className="font-bold text-base">Season {season.seasonNumber}</div>
                            <div className="text-sm text-gray-400 mt-0.5 line-clamp-1">{seasonTitle}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{season.episodeCount} Episodes</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Episodes Horizontal Scroll with Arrow Navigation */}
            <div className="relative group">
              {/* Left Arrow - Centered Vertically */}
              <button
                onClick={() => {
                  const container = document.getElementById('anime-episodes-scroll');
                  if (container) {
                    container.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 items-center justify-center bg-cyan-500 rounded-full hover:bg-cyan-400 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-xl"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div 
                id="anime-episodes-scroll"
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              >
                {Array.from({ length: currentSeasonEpisodes }, (_, i) => i + 1).map((episodeNum) => {
                  const tmdbEpisode = episodeDetails.get(episodeNum);
                  const thumbnailUrl = tmdbEpisode?.stillPath ? getBackdropUrl(tmdbEpisode.stillPath, 'medium') : null;
                  
                  // Use TMDB data if available, otherwise fallback to anime data
                  const episodeTitle = tmdbEpisode?.name || `Episode ${episodeNum}`;
                  const episodeDate = tmdbEpisode?.airDate;
                  const episodeRating = tmdbEpisode?.rating || 0;
                  const episodeOverview = tmdbEpisode?.overview || anime.description?.replace(/<[^>]*>/g, '').substring(0, 100) || '';
                  const episodeRuntime = tmdbEpisode?.runtime || anime.duration;
                  
                  return (
                  <div
                    key={episodeNum}
                    className="flex-shrink-0 w-[240px] md:w-[280px]"
                  >
                    <div
                      className="cursor-pointer group/card"
                      onClick={() => {
                        setSelectedEpisode(episodeNum);
                        router.push(`/watch/anime/${currentSeasonId}/${episodeNum}`);
                      }}
                    >
                      <div className="relative aspect-video rounded-md overflow-hidden bg-gray-800 group-hover/card:ring-2 group-hover/card:ring-cyan-400 transition-all">
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={episodeTitle}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                            <span className="text-white text-4xl font-bold opacity-20">{episodeNum}</span>
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2 bg-cyan-500 rounded px-2 py-0.5">
                          <span className="text-white text-xs font-bold">EP {episodeNum}</span>
                        </div>

                        {episodeRuntime && (
                          <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-0.5">
                            <span className="text-white text-xs font-semibold">{episodeRuntime}m</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>

                      <div className="mt-2 space-y-2">
                        {/* Episode Title */}
                        <h3 className="text-white font-bold text-sm line-clamp-1">
                          {episodeNum}. {episodeTitle}
                        </h3>
                        
                        {/* Air Date and Rating Row */}
                        <div className="flex items-center gap-2 text-xs">
                          {episodeDate && (
                            <span className="text-gray-400 flex items-center gap-1">
                              📅 {new Date(episodeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                          {episodeRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span className="text-yellow-500 font-semibold">
                                {episodeRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Episode Description */}
                        {episodeOverview && (
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {episodeOverview}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Right Arrow - Centered Vertically */}
              <button
                onClick={() => {
                  const container = document.getElementById('anime-episodes-scroll');
                  if (container) {
                    container.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 items-center justify-center bg-cyan-500 rounded-full hover:bg-cyan-400 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-xl"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Similar Anime - Placeholder */}
      <div className="pb-8 md:pb-12">
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-3xl font-bold text-white">Similar Anime</h2>
            <p className="text-gray-400 text-sm mt-2">Coming soon - Similar anime recommendations</p>
          </div>
        </div>
      </div>

      {/* More Like This - Placeholder */}
      <div className="pb-8 md:pb-12">
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-3xl font-bold text-white">More Like This</h2>
            <p className="text-gray-400 text-sm mt-2">Coming soon - More recommendations</p>
          </div>
        </div>
      </div>

      {/* Trailers & Videos - Placeholder */}
      {anime.trailer && anime.trailer.site === 'youtube' && (
        <motion.section
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 md:py-12"
          style={{ paddingLeft: padding.left, paddingRight: padding.right }}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Trailers & Videos</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <div
                className="flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer group"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${anime.trailer.id}`, '_blank')}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={`https://img.youtube.com/vi/${anime.trailer.id}/hqdefault.jpg`}
                    alt="Trailer"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-white font-medium text-sm line-clamp-2">Official Trailer</p>
                  <p className="text-gray-400 text-xs mt-1">Trailer</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AppShell>
  );
}
