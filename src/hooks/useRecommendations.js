// src/hooks/useRecommendations.js
import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/store';
import { fetchMovies } from '../services/omdbService';

/**
 * Custom hook for fetching recommendations based on profile preferences
 * Supports multiple recommendation types: personalized, trending, similar, and genre-based
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.type - Recommendation type ('personalized', 'trending', 'similar', 'genre')
 * @param {string} options.contentId - Content ID for 'similar' recommendations
 * @param {string} options.genre - Genre for genre-based recommendations
 * @param {number} options.resultLimit - Maximum number of results to return
 * @returns {Object} - Recommendations data, loading state, and error state
 */
const useRecommendations = ({
    type = 'personalized',
    contentId = null,
    genre = null,
    resultLimit = 10
}) => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentProfile, viewingHistory } = useStore();

    // Transform API movie data to app format
    const transformMovieData = useCallback((movies) => {
        if (!movies || !Array.isArray(movies)) return [];

        return movies.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster !== 'N/A' ? movie.Poster : null,
            thumbnail: movie.Poster !== 'N/A' ? movie.Poster : null,
            year: movie.Year
        }));
    }, []);

    // Fetch recommendations based on type and parameters
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!currentProfile) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                let searchTerm;

                // Determine search term based on recommendation type
                switch (type) {
                    case 'personalized':
                        // Get recommendations based on user preferences
                        searchTerm = currentProfile.preferences?.genres?.[0] || 'popular';
                        break;
                    case 'trending':
                        searchTerm = 'trending';
                        break;
                    case 'similar':
                        // For similar content recommendations
                        if (!contentId && !genre) {
                            throw new Error('contentId or genre is required for similar recommendations');
                        }
                        searchTerm = genre || 'action'; // Default to action
                        break;
                    case 'genre':
                        if (!genre) {
                            throw new Error('genre is required for genre recommendations');
                        }
                        searchTerm = genre;
                        break;
                    default:
                        searchTerm = 'popular';
                }

                const movies = await fetchMovies(searchTerm);
                const transformedMovies = transformMovieData(movies);

                // Filter out already watched content for personalized recommendations
                if (type === 'personalized' && viewingHistory.length > 0) {
                    const watchedIds = viewingHistory.map(item => item.id);
                    const filteredItems = transformedMovies.filter(item => !watchedIds.includes(item.id));
                    setRecommendations(filteredItems.slice(0, resultLimit));
                } else {
                    setRecommendations(transformedMovies.slice(0, resultLimit));
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(err.message || 'Failed to fetch recommendations');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [type, contentId, genre, resultLimit, currentProfile, viewingHistory, transformMovieData]);

    return { recommendations, isLoading, error };
};

export default useRecommendations;