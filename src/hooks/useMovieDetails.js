// src/hooks/useMovieDetails.js
import { useState, useEffect } from 'react';
import { fetchMovieDetails } from '../services/omdbService';
import useStore from '../store/store';

/**
 * Custom hook for fetching and tracking movie details
 * Handles loading states, error handling, and interaction tracking
 */
const useMovieDetails = (movieId) => {
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentProfile, trackInteraction, addToHistory } = useStore();

    useEffect(() => {
        const getMovieDetails = async () => {
            if (!movieId) return;

            setIsLoading(true);
            setError(null);

            try {
                const movieData = await fetchMovieDetails(movieId);
                if (movieData) {
                    // Transform API data to application format
                    const formattedMovie = {
                        id: movieData.imdbID,
                        title: movieData.Title,
                        description: movieData.Plot,
                        year: movieData.Year,
                        poster: movieData.Poster !== 'N/A' ? movieData.Poster : null,
                        backdrop: movieData.Poster !== 'N/A' ? movieData.Poster : null,
                        rating: movieData.Rated,
                        genres: movieData.Genre.split(', '),
                        director: movieData.Director,
                        cast: movieData.Actors.split(', '),
                        duration: movieData.Runtime
                    };

                    setMovie(formattedMovie);

                    // Track view and add to history if user is logged in
                    if (currentProfile) {
                        trackInteraction(movieData.imdbID, 'view');
                        addToHistory({
                            id: movieData.imdbID,
                            title: movieData.Title,
                            poster: movieData.Poster !== 'N/A' ? movieData.Poster : null,
                            thumbnail: movieData.Poster !== 'N/A' ? movieData.Poster : null,
                            progress: 0,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError(err.message || 'Failed to load movie details');
            } finally {
                setIsLoading(false);
            }
        };

        getMovieDetails();
    }, [movieId, currentProfile, trackInteraction, addToHistory]);

    return { movie, isLoading, error };
};

export default useMovieDetails;