'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Info, Star, Calendar, Clock, Users, Tv } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RatingBadge } from '@/components/media/rating-badge';
import { GenreBadge } from '@/components/media/genre-badge';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { fadeInUpVariants } from '@/styles/animations';
import { 
  useTVDetails, 
  useTVCredits, 
  useTVRecommendations,
  useSimilarTV,
  useTVImages,
  useTVVideos,
  useSeasonDetails
} from '@/hooks/tmdb/use-tv';
import { getPosterUrl, getBackdropUrl, getProfileUrl, getLogoUrl } from '@/services/tmdb/images';
import { formatDate } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';

export default function TVDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const tvId = parseInt(resolvedParams.id);
  const padding = useResponsivePadding();
  
  const { data: tvShow, isLoading: loadingTV, error, refetch } = useTVDetails(tvId);
  const { data: credits } = useTVCredits(tvId);
  const { data: recommendations } = useTVRecommendations(tvId);
  const { data: similarShows } = useSimilarTV(tvId);
  const { data: images } = useTVImages(tvId);
  const { data: videos } = useTVVideos(tvId);
  
  // State for selected season
  const [selectedSeasonNumber, setSelectedSeasonNumber] = React.useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedTrailer, setSelectedTrailer] = React.useState<string | null>(null);
  const { data: seasonDetails } = useSeasonDetails(tvId, selectedSeasonNumber);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const isFavorite = useUserStore((state) => state.isFavorite(tvId));
  const addFavorite = useUserStore((state) => state.addFavorite);
  const removeFavorite = useUserStore((state) => state.removeFavorite);

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

  const handlePlay = () => {
    // Play first episode of first season
    router.push(`/watch/tv/${resolvedParams.id}/1/1`);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(tvId);
    } else if (tvShow) {
      addFavorite({
        id: tvShow.id,
        type: 'tv',
        title: tvShow.name,
        posterPath: tvShow.poster_path,
        backdropPath: tvShow.backdrop_path,
        addedAt: Date.now(),
      });
    }
  };

  if (loadingTV || !tvShow) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AppShell>
        <ApiError
          error={error as Error}
          message="Failed to load TV show details"
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const transformTV = (show: any) => {
    const posterUrl = getPosterUrl(show.poster_path);
    return {
      id: show.id,
      title: show.name,
      name: show.name,
      posterPath: posterUrl && posterUrl.length > 0 ? posterUrl : '/placeholder.png',
      voteAverage: show.vote_average,
      releaseDate: show.first_air_date,
      genreIds: show.genre_ids,
    };
  };

  // Get official logo from TMDB
  const officialLogo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en') || images?.logos?.[0];
  const logoUrl = officialLogo?.file_path ? getLogoUrl(officialLogo.file_path, 'original') : null;

  // Get trailer
  const trailer = videos?.results?.find((video: any) => 
    video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos?.results?.find((video: any) => video.site === 'YouTube');

  // Get creator
  const creator = tvShow.created_by && tvShow.created_by.length > 0 ? tvShow.created_by[0] : null;

  // Get top cast (first 12)
  const topCast = credits?.cast?.slice(0, 12) || [];

  return (
    <AppShell>
      {/* Combined Hero Banner Section */}
      <div className="relative w-full min-h-screen">
        {/* Backdrop Image */}
        {tvShow.backdrop_path && (
          <Image
            src={getBackdropUrl(tvShow.backdrop_path, 'original') || ''}
            alt={tvShow.name}
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
          {/* Logo or Title */}
          {logoUrl ? (
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-lg h-36 md:h-44 mb-6"
            >
              <Image
                src={logoUrl}
                alt={tvShow.name}
                fill
                className="object-contain object-left"
              />
            </motion.div>
          ) : (
            <motion.h1
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white max-w-4xl mb-6"
            >
              {tvShow.name}
            </motion.h1>
          )}

          {/* Metadata */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-4 mb-2"
          >
            <RatingBadge rating={tvShow.vote_average} size="lg" />
            <span className="text-gray-200 text-lg font-medium">
              {formatDate(tvShow.first_air_date, 'year')}
            </span>
            {tvShow.number_of_seasons && (
              <span className="text-gray-200 text-lg flex items-center gap-1">
                <Tv className="w-4 h-4" />
                {tvShow.number_of_seasons} {tvShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
              </span>
            )}
            {tvShow.vote_count && (
              <span className="text-gray-200 text-lg flex items-center gap-1">
                <Users className="w-4 h-4" />
                {tvShow.vote_count.toLocaleString()} votes
              </span>
            )}
          </motion.div>

          {/* Genres */}
          {tvShow.genres && tvShow.genres.length > 0 && (
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mb-4"
            >
              {tvShow.genres.map((genre) => (
                <GenreBadge key={genre.id} genre={genre.name} />
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
            {trailer && (
              <button
                onClick={() => setSelectedTrailer(trailer.key)}
                className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg font-bold text-lg hover:bg-white/30 focus:bg-white/30 focus:scale-105 transition-all focus:ring-4 focus:ring-white/50 focus:outline-none"
              >
                <Info className="w-6 h-6" />
                Watch Trailer
              </button>
            )}
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
              {tvShow.overview}
            </p>
          </motion.div>

          {/* TV Show Info Grid - Compact Single Line */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-start gap-x-6 gap-y-2 max-w-[50vw]"
            style={{ marginTop: '37px' }}
          >
            {creator && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Creator</h3>
                <p className="text-xs text-white font-medium line-clamp-1">{creator.name}</p>
              </div>
            )}
            
            {tvShow.production_companies && tvShow.production_companies.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Production</h3>
                <p className="text-xs text-white font-medium line-clamp-1">
                  {tvShow.production_companies.slice(0, 2).map((c: any) => c.name).join(', ')}
                </p>
              </div>
            )}

            {tvShow.status && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Status</h3>
                <p className="text-xs text-white font-medium">{tvShow.status}</p>
              </div>
            )}

            {tvShow.type && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Type</h3>
                <p className="text-xs text-white font-medium">{tvShow.type}</p>
              </div>
            )}

            {tvShow.original_language && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Language</h3>
                <p className="text-xs text-white font-medium uppercase">{tvShow.original_language}</p>
              </div>
            )}

            {tvShow.networks && tvShow.networks.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Network</h3>
                <p className="text-xs text-white font-medium line-clamp-1">{tvShow.networks[0].name}</p>
              </div>
            )}
          </motion.div>

          {/* Cast & Crew - Horizontal Single Line */}
          {topCast.length > 0 && (
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 max-w-[50vw]"
              style={{ marginTop: '37px' }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-white">Cast & Crew</h2>
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {topCast.map((actor: any) => (
                  <div key={actor.id} className="flex-shrink-0 w-16 md:w-20 space-y-1">
                    <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
                      {actor.profile_path ? (
                        <Image
                          src={getProfileUrl(actor.profile_path) || ''}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-[10px] line-clamp-1">{actor.name}</p>
                      <p className="text-gray-400 text-[8px] line-clamp-1">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* TV Show Details - MOVED UP */}
      <motion.section
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-8 md:py-12"
        style={{ paddingLeft: padding.left, paddingRight: padding.right }}
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">TV Show Details</h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">First Air Date</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(tvShow.first_air_date)}
                </p>
              </div>
              {tvShow.last_air_date && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Last Air Date</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(tvShow.last_air_date)}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Rating</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {tvShow.vote_average.toFixed(1)}/10 ({tvShow.vote_count?.toLocaleString()} votes)
                </p>
              </div>
              {tvShow.episode_run_time && tvShow.episode_run_time.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Episode Runtime</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ~{tvShow.episode_run_time[0]} min
                  </p>
                </div>
              )}
              {tvShow.production_countries && tvShow.production_countries.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Countries</p>
                  <p className="text-sm text-white">
                    {tvShow.production_countries.map((c: any) => c.name).join(', ')}
                  </p>
                </div>
              )}
              {tvShow.number_of_episodes && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Total Episodes</p>
                  <p className="text-sm text-white">
                    {tvShow.number_of_episodes} Episodes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Seasons & Episodes Section - MOVED DOWN, NO THUMBNAILS, WITH ARROW */}
      {tvShow.seasons && tvShow.seasons.filter(s => s.season_number > 0).length > 0 && (
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
              <h2 className="text-3xl font-bold text-white">Seasons & Episodes</h2>
              
              {/* Custom Season Dropdown - Matching Screenshot Design */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between min-w-[240px] bg-gray-700/90 text-white rounded-lg px-5 py-3 text-base font-semibold hover:bg-gray-600/90 transition-colors border border-gray-600"
                >
                  <span>Season {selectedSeasonNumber}</span>
                  <svg className="w-5 h-5 text-white ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 min-w-[240px] bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl z-50 overflow-hidden">
                    {tvShow.seasons.filter(s => s.season_number > 0).map((season: any) => (
                      <button
                        key={season.id}
                        onClick={() => {
                          setSelectedSeasonNumber(season.season_number);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 transition-colors ${
                          selectedSeasonNumber === season.season_number
                            ? 'bg-red-600 text-white font-bold'
                            : 'text-gray-300 hover:bg-gray-700/80'
                        }`}
                      >
                        <div className="font-bold text-base">Season {season.season_number}</div>
                        <div className="text-sm text-gray-400 mt-0.5">{season.episode_count} Episodes</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Episodes with Thumbnails, Description Outside, Left/Right Arrows */}
            {seasonDetails?.episodes && seasonDetails.episodes.length > 0 && (
              <div className="relative group">
                {/* Left Arrow - Centered Vertically */}
                <button
                  onClick={() => {
                    const container = document.getElementById('episodes-scroll-container');
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

                {/* Episodes Container */}
                <div 
                  id="episodes-scroll-container"
                  className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                >
                  {seasonDetails.episodes.map((episode: any) => (
                    <div
                      key={episode.id}
                      className="flex-shrink-0 w-[240px] md:w-[280px]"
                    >
                      {/* Episode Card with Thumbnail - Clickable */}
                      <div
                        className="cursor-pointer group/card"
                        onClick={() => router.push(`/watch/tv/${tvId}/${selectedSeasonNumber}/${episode.episode_number}`)}
                      >
                        {/* Thumbnail with badges */}
                        <div className="relative aspect-video rounded-md overflow-hidden bg-gray-800 group-hover/card:ring-2 group-hover/card:ring-cyan-400 transition-all">
                          {(() => {
                            const imageUrl = getBackdropUrl(episode.still_path, 'medium');
                            console.log('=== EPISODE THUMBNAIL DEBUG ===');
                            console.log('Episode:', episode.episode_number, episode.name);
                            console.log('still_path:', episode.still_path);
                            console.log('Generated URL:', imageUrl);
                            console.log('===============================');
                            return null;
                          })()}
                          {episode.still_path ? (
                            <img
                              src={getBackdropUrl(episode.still_path, 'medium') || ''}
                              alt={episode.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                              <Tv className="w-12 h-12 text-gray-500" />
                            </div>
                          )}
                          
                          {/* Episode Number Badge - Top Left */}
                          <div className="absolute top-2 left-2 bg-cyan-500 rounded px-2 py-0.5">
                            <span className="text-white text-xs font-bold">EP {episode.episode_number}</span>
                          </div>

                          {/* Runtime Badge - Top Right */}
                          {episode.runtime && (
                            <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-0.5">
                              <span className="text-white text-xs font-semibold">{episode.runtime}m</span>
                            </div>
                          )}
                        </div>

                        {/* Episode Info Below Card */}
                        <div className="mt-2 space-y-1">
                          {/* Episode Title */}
                          <h3 className="text-white font-bold text-sm line-clamp-1">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          
                          {/* Air Date and Rating - Same Line */}
                          <div className="flex items-center gap-2 text-xs">
                            {episode.air_date && (
                              <span className="text-gray-400">
                                📅 {formatDate(episode.air_date, 'short')}
                              </span>
                            )}
                            {episode.vote_average > 0 && (
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-yellow-500 font-semibold">
                                  {episode.vote_average.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Episode Description - OUTSIDE card, below everything */}
                      {episode.overview && (
                        <p className="mt-2 text-gray-400 text-xs leading-relaxed line-clamp-3">
                          {episode.overview}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Arrow - Centered Vertically */}
                <button
                  onClick={() => {
                    const container = document.getElementById('episodes-scroll-container');
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
            )}

            {/* Loading State */}
            {!seasonDetails && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            )}

            {/* No Episodes State */}
            {seasonDetails?.episodes && seasonDetails.episodes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Tv className="w-16 h-16 mb-4" />
                <p className="text-lg">No episodes available for this season</p>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Similar TV Shows */}
      {similarShows && similarShows.length > 0 && (
        <div className="pb-8 md:pb-12">
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-3xl font-bold text-white">Similar TV Shows</h2>
            </div>
            <SimpleMediaCarousel
              items={similarShows.map(transformTV)}
              type="tv"
              onItemClick={(id) => router.push(`/tv/${id}`)}
              zoneId="tv-details-similar"
            />
          </div>
        </div>
      )}

      {/* More Like This */}
      {recommendations && recommendations.length > 0 && (
        <div className="pb-8 md:pb-12">
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-3xl font-bold text-white">More Like This</h2>
            </div>
            <SimpleMediaCarousel
              items={recommendations.map(transformTV)}
              type="tv"
              onItemClick={(id) => router.push(`/tv/${id}`)}
              zoneId="tv-details-recommendations"
            />
          </div>
        </div>
      )}

      {/* Trailers & Videos Section - Horizontal Single Line */}
      {videos?.results && videos.results.length > 0 && (
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
              {videos.results.slice(0, 5).map((video: any, index: number) => (
                <div
                  key={video.id || index}
                  className="flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer group"
                  onClick={() => setSelectedTrailer(video.key)}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                      alt={video.name}
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
                    <p className="text-white font-medium text-sm line-clamp-2">{video.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{video.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* YouTube Player Modal */}
      {selectedTrailer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedTrailer(null)}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTrailer(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* YouTube Embed */}
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
