// src/services/youtubeTrailerService.js

/**
 * Service to fetch movie trailers from YouTube
 * Provides functionality to search for trailers and open them in a new tab
 */

/**
 * Search for a movie trailer on YouTube and return the URL
 * 
 * @param {string} movieTitle - The title of the movie
 * @param {string} year - Optional release year
 * @returns {Promise<string>} YouTube URL for the trailer
 */
export const findTrailerUrl = async (movieTitle, year = '') => {
    if (!movieTitle) {
        throw new Error('Movie title is required');
    }

    try {
        // Build a YouTube search URL with appropriate keywords for trailer search
        const searchTerm = `${movieTitle} ${year} official trailer`;
        const encodedSearch = encodeURIComponent(searchTerm);

        // For direct linking without API, return the search results URL
        // This will be opened in a new tab if the embedded player fails
        return `https://www.youtube.com/results?search_query=${encodedSearch}`;
    } catch (error) {
        console.error('Error in youtubeTrailerService:', error);
        throw error;
    }
};

/**
 * Open a trailer search in a new tab
 * Accepts either a movie object or title/year parameters
 * 
 * @param {Object|string} movieOrTitle - Movie object or movie title string
 * @param {string} year - Optional release year (when first param is title string)
 */
export const openTrailerInNewTab = (movieOrTitle, year = '') => {
    let title, releaseYear;

    // Handle different parameter formats
    if (typeof movieOrTitle === 'object' && movieOrTitle !== null) {
        // Extract from movie object
        title = movieOrTitle.title || movieOrTitle.Title || '';
        releaseYear = movieOrTitle.year || movieOrTitle.Year || '';
    } else if (typeof movieOrTitle === 'string') {
        // Use directly as title
        title = movieOrTitle;
        releaseYear = year;
    } else {
        console.error('Invalid movie parameter');
        return;
    }

    if (!title) {
        console.error('Movie title is required');
        return;
    }

    // Build search query and open in new tab
    const searchQuery = encodeURIComponent(`${title} ${releaseYear} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank', 'noopener,noreferrer');
};

export default {
    findTrailerUrl,
    openTrailerInNewTab
};