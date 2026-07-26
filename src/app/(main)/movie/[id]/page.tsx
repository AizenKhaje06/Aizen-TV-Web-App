'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Info, Star, Calendar, Clock, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RatingBadge } from '@/components/media/rating-badge';
import { GenreBadge } from '@/components/media/genre-badge';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { fadeInUpVariants } from '@/styles/animations';
import { 
  useMovieDetails, 
  useMovieCredits, 
  useMovieRecommendations,
  useSimilarMovies,
  useMovieImages,
  useMovieVideos
} from '@/hooks/tmdb/use-movies';
import { getPosterUrl, getBackdropUrl, getProfileUrl, getLogoUrl } from '@/services/tmdb/images';
import { formatRuntime, formatDate, formatCurrency } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const movieId = parseInt(resolvedParams.id);
  const padding = useResponsivePadding();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: movie, isLoading: loadingMovie, error, refetch } = useMovieDetails(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: recommendations } = useMovieRecommendations(movieId);
  const { data: similarMovies } = useSimilarMovies(movieId);
  const { data: images } = useMovieImages(movieId);
  const { data: videos } = useMovieVideos(movieId);
  
  const isFavorite = useUserStore((state) => state.isFavorite(movieId));
  const addFavorite = useUserStore((state) => state.addFavorite);
  const removeFavorite = useUserStore((state) => state.removeFavorite);

  const handlePlay = () => {
    router.push(`/watch/movie/${resolvedParams.id}`);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(movieId);
    } else if (movie) {
      addFavorite({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        addedAt: Date.now(),
      });
    }
  };

  if (loadingMovie || !movie) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AppShell>
        <ApiError
          error={error as Error}
          message="Failed to load movie details"
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const transformMovie = (m: any) => {
    const posterUrl = getPosterUrl(m.poster_path);
    return {
      id: m.id,
      title: m.title,
      name: m.title,
      posterPath: posterUrl && posterUrl.length > 0 ? posterUrl : '/placeholder.png',
      voteAverage: m.vote_average,
      releaseDate: m.release_date,
      genreIds: m.genre_ids,
    };
  };

  // Get official logo
  const officialLogo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en') || images?.logos?.[0];
  const logoUrl = officialLogo?.file_path ? getLogoUrl(officialLogo.file_path, 'original') : null;

  // Get trailer
  const trailer = videos?.results?.find((video: any) => 
    video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos?.results?.find((video: any) => video.site === 'YouTube');

  // Get director
  const director = credits?.crew?.find((person: any) => person.job === 'Director');

  // Get top cast (first 12)
  const topCast = credits?.cast?.slice(0, 12) || [];

  // Get gallery images (backdrops)
  const galleryImages = images?.backdrops?.slice(0, 12) || [];

  return (
    <AppShell>
      {/* Combined Hero Banner Section */}
      <div className="relative w-full min-h-screen">
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <Image
            src={getBackdropUrl(movie.backdrop_path, 'original') || ''}
            alt={movie.title}
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
                alt={movie.title}
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
              {movie.title}
            </motion.h1>
          )}

          {/* Metadata */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-4 mb-2"
          >
            <RatingBadge rating={movie.vote_average} size="lg" />
            <span className="text-gray-200 text-lg font-medium">
              {formatDate(movie.release_date, 'year')}
            </span>
            {movie.runtime > 0 && (
              <span className="text-gray-200 text-lg flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatRuntime(movie.runtime)}
              </span>
            )}
            {movie.vote_count && (
              <span className="text-gray-200 text-lg flex items-center gap-1">
                <Users className="w-4 h-4" />
                {movie.vote_count.toLocaleString()} votes
              </span>
            )}
          </motion.div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mb-4"
            >
              {movie.genres.map((genre) => (
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
                onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
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
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">Synopsis</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {movie.overview}
            </p>
          </motion.div>

          {/* Movie Info Grid - Compact Single Line */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-start gap-x-6 gap-y-2 max-w-[50vw]"
          >
            {director && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Director</h3>
                <p className="text-xs text-white font-medium line-clamp-1">{director.name}</p>
              </div>
            )}
            
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Production</h3>
                <p className="text-xs text-white font-medium line-clamp-1">
                  {movie.production_companies.slice(0, 2).map((c: any) => c.name).join(', ')}
                </p>
              </div>
            )}

            {movie.budget && movie.budget > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Budget</h3>
                <p className="text-xs text-white font-medium">{formatCurrency(movie.budget)}</p>
              </div>
            )}

            {movie.revenue && movie.revenue > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Revenue</h3>
                <p className="text-xs text-white font-medium">{formatCurrency(movie.revenue)}</p>
              </div>
            )}

            {movie.status && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Status</h3>
                <p className="text-xs text-white font-medium">{movie.status}</p>
              </div>
            )}

            {movie.original_language && (
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Language</h3>
                <p className="text-xs text-white font-medium uppercase">{movie.original_language}</p>
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

      {/* Movie Details */}
      <motion.section
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-8 md:py-12"
        style={{ paddingLeft: padding.left, paddingRight: padding.right }}
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Movie Details</h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Release Date</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {formatDate(movie.release_date)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Runtime</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {formatRuntime(movie.runtime)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Rating</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  {movie.vote_average.toFixed(1)}/10 ({movie.vote_count?.toLocaleString()} votes)
                </p>
              </div>
              {movie.production_countries && movie.production_countries.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Countries</p>
                  <p className="text-lg text-white">
                    {movie.production_countries.map((c: any) => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Similar Movies */}
      {similarMovies && similarMovies.length > 0 && (
        <div className="pb-8 md:pb-12">
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-3xl font-bold text-white">Similar Movies</h2>
            </div>
            <SimpleMediaCarousel
              items={similarMovies.map(transformMovie)}
              type="movie"
              onItemClick={(id) => router.push(`/movie/${id}`)}
              zoneId="movie-details-similar"
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
              items={recommendations.map(transformMovie)}
              type="movie"
              onItemClick={(id) => router.push(`/movie/${id}`)}
              zoneId="movie-details-recommendations"
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
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')}
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

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-7xl aspect-video">
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
