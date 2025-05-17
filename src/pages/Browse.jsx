// src/pages/Browse.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import ContentRow from '../components/features/ContentRow';
import SearchResults from '../components/features/SearchResults';
import useStore from '../store/store';
import { fetchMovies } from '../services/omdbService';
import { openTrailerInNewTab } from '../services/youtubeTrailerService';

/**
 * Main content browsing page
 * Displays personalized recommendations, trending content, and search results
 */
const Browse = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('query');
    const { currentProfile } = useStore();
    const [heroContent, setHeroContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [otherWatchedContent, setOtherWatchedContent] = useState([]);

    // Redirect to profile selection if no profile is selected
    useEffect(() => {
        if (!currentProfile) {
            navigate('/profile');
        }
    }, [currentProfile, navigate]);

    // Handle search query if present
    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery) return;

            setIsLoading(true);
            try {
                const results = await fetchMovies(searchQuery);
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [searchQuery]);

    // Fetch hero content and trending data
    useEffect(() => {
        // Skip fetching hero content when searching
        if (searchQuery) {
            setIsLoading(false);
            return;
        }

        const fetchFeaturedContent = async () => {
            setIsLoading(true);
            try {
                // For hero content, fetch a popular movie
                const popularMovies = await fetchMovies('trending');

                if (popularMovies?.length > 0) {
                    // Select a random movie from the first 5 results for hero content
                    const randomIndex = Math.floor(Math.random() * Math.min(5, popularMovies.length));
                    const selectedMovie = popularMovies[randomIndex];

                    // Transform the data format to match what our component expects
                    setHeroContent({
                        id: selectedMovie.imdbID,
                        title: selectedMovie.Title,
                        description: 'Featured content for your entertainment',
                        poster: selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : null,
                        backdrop: selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : null,
                        year: selectedMovie.Year,
                        tagline: `${selectedMovie.Year} • Movie`
                    });
                }

                // Fetch movies for "Popular With Similar Viewers..." section
                const otherGenre = getOppositeGenre(currentProfile?.preferences?.genres?.[0]);
                const otherGenreMovies = await fetchMovies(otherGenre);

                if (otherGenreMovies?.length > 0) {
                    // Transform data to match expected format
                    const transformedMovies = otherGenreMovies.map(movie => ({
                        id: movie.imdbID,
                        title: movie.Title,
                        poster: movie.Poster !== 'N/A' ? movie.Poster : null,
                        thumbnail: movie.Poster !== 'N/A' ? movie.Poster : null,
                        year: movie.Year
                    }));

                    setOtherWatchedContent(transformedMovies);
                }
            } catch (error) {
                console.error('Error fetching featured content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedContent();
    }, [searchQuery, currentProfile]);

    /**
     * Get opposite genre for collaborative filtering demo
     * Simulates Netflix's "Because you watched X, you might like Y" feature
     */
    const getOppositeGenre = (genre) => {
        const genrePairs = {
            'action': 'romance',
            'comedy': 'horror',
            'drama': 'sci-fi',
            'thriller': 'family',
            'horror': 'comedy',
            'sci-fi': 'drama',
            'romance': 'action',
            'documentary': 'fantasy',
            'fantasy': 'documentary',
            'family': 'thriller'
        };

        return genrePairs[genre?.toLowerCase()] || 'trending';
    };

    // Navigate to movie detail page
    const handleMovieClick = (movieId) => {
        navigate(`/watch/${movieId}`);
    };

    // Handle trailer button click for search results
    const handleTrailerClick = (movie) => {
        openTrailerInNewTab({
            title: movie.Title,
            year: movie.Year
        });
    };

    // Get profile-specific viewing history with memoization
    const profileViewingHistory = useMemo(() => {
        return currentProfile?.viewingHistory || [];
    }, [currentProfile]);

    // Loading state
    if (isLoading && !heroContent && !searchQuery) {
        return (
            <div className="min-h-screen bg-netflix-black">
                <Header />
                <div className="pt-20 flex justify-center items-center">
                    <div className="animate-pulse text-netflix-red text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-netflix-black">
            <Header />

            <div className="pt-16 px-4">
                {/* Search Results Section */}
                {searchQuery ? (
                    <SearchResults
                        query={searchQuery}
                        results={searchResults}
                        onMovieClick={handleMovieClick}
                        onTrailerClick={handleTrailerClick}
                    />
                ) : (
                    <>
                        {/* Hero Section */}
                        {heroContent && (
                            <div className="relative pt-4 pb-8 min-h-[500px] md:min-h-[600px]">
                                <div className="absolute inset-0 z-0 bg-netflix-black">
                                    {/* Hero background with poster image or fallback */}
                                    <div className="w-full h-full bg-netflix-dark flex items-center justify-center">
                                        {heroContent.backdrop ? (
                                            <img
                                                src={heroContent.backdrop}
                                                alt={heroContent.title}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                        ) : (
                                            <div className="text-netflix-red text-4xl font-bold opacity-60">
                                                {heroContent.title}
                                            </div>
                                        )}
                                    </div>
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-black to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-transparent to-transparent"></div>
                                </div>

                                <div className="relative z-10 px-4 md:px-8 pt-32 md:pt-48 max-w-2xl">
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{heroContent.title}</h1>
                                    {heroContent.tagline && (
                                        <h2 className="text-xl md:text-2xl text-gray-200 mb-4 italic">{heroContent.tagline}</h2>
                                    )}
                                    <p className="text-gray-300 mb-6 line-clamp-3">{heroContent.description}</p>
                                    <div className="flex space-x-4">
                                        <button
                                            className="netflix-button flex items-center"
                                            onClick={() => navigate(`/watch/${heroContent.id}`)}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                            Play
                                        </button>
                                        <button className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition-colors flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            More Info
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Rows */}
                        <div className="pb-16">
                            {/* Personalized recommendations */}
                            {currentProfile?.preferences?.genres && (
                                <ContentRow
                                    title={`Top Picks for ${currentProfile.name}`}
                                    searchTerm={currentProfile.preferences.genres[0]}
                                    isRecommended={true}
                                />
                            )}

                            {/* Collaborative filtering section */}
                            {otherWatchedContent.length > 0 && (
                                <ContentRow
                                    title="Popular With Similar Viewers"
                                    contentItems={otherWatchedContent}
                                    isCollaborative={true}
                                />
                            )}

                            {/* Trending now */}
                            <ContentRow
                                title="Trending Now"
                                searchTerm="trending"
                            />

                            {/* Continue watching - Now profile-specific */}
                            {profileViewingHistory.length > 0 && (
                                <ContentRow
                                    title="Continue Watching"
                                    contentItems={profileViewingHistory.slice(0, 10)}
                                />
                            )}

                            {/* Genre-specific categories */}
                            <ContentRow title="Action Movies" searchTerm="action" />
                            <ContentRow title="Comedy" searchTerm="comedy" />
                            <ContentRow title="Sci-Fi" searchTerm="sci-fi" />
                            <ContentRow title="Drama" searchTerm="drama" />
                            <ContentRow title="Horror" searchTerm="horror" />
                            <ContentRow title="Documentaries" searchTerm="documentary" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Browse;