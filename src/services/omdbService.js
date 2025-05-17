// src/services/omdbService.js

/**
 * Service for fetching movie data from OMDb API
 * Includes error handling and data transformation
 */

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Fetch movies by search term
 * @param {string} searchTerm - Term to search for
 * @param {number} page - Page number for pagination
 * @returns {Promise<Array>} - Array of movie objects
 */
export const fetchMovies = async (searchTerm, page = 1) => {
    if (!searchTerm?.trim()) {
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`
        );

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'True') {
            return data.Search || [];
        }

        // Handle API error responses
        console.error('OMDb API error:', data.Error);
        return [];
    } catch (error) {
        console.error('Error fetching from OMDb:', error);
        return [];
    }
};

/**
 * Fetch movie details by IMDB ID
 * @param {string} imdbID - IMDB ID of the movie
 * @returns {Promise<Object|null>} - Movie details object or null
 */
export const fetchMovieDetails = async (imdbID) => {
    if (!imdbID) {
        throw new Error('IMDB ID is required');
    }

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'True') {
            return data;
        }

        console.error('OMDb API error:', data.Error);
        return null;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error; // Re-throw to allow components to handle the error
    }
};

/**
 * Get content by category/genre
 * @param {string} category - Category/genre to fetch
 * @returns {Promise<Array>} - Array of movie objects
 */
export const getCategoryContent = async (category) => {
    // Map Netflix categories to search terms
    const categoryMappings = {
        trending: 'marvel', // Popular franchises
        action: 'action',
        comedy: 'comedy',
        horror: 'horror',
        documentary: 'documentary',
        drama: 'drama',
        thriller: 'thriller',
        scifi: 'sci-fi',
        fantasy: 'fantasy'
    };

    const searchTerm = categoryMappings[category.toLowerCase()] || category;
    return await fetchMovies(searchTerm);
};