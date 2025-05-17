// src/hooks/useSearch.js
import { useState, useEffect } from 'react';
import { fetchMovies } from '../services/omdbService';

/**
 * Custom hook for search functionality
 * Includes debouncing and error handling
 */
const useSearch = (initialQuery = '') => {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    // Search effect with debounce
    useEffect(() => {
        // Don't search if query is too short
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setError(null);
            return;
        }

        // Debounce search to avoid excessive API calls
        const timer = setTimeout(async () => {
            setIsSearching(true);
            setError(null);

            try {
                const searchResults = await fetchMovies(query);
                setResults(searchResults);
            } catch (err) {
                console.error('Search error:', err);
                setError(err.message || 'Search failed');
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    return {
        query,
        setQuery,
        results,
        isSearching,
        error,
        hasResults: results.length > 0
    };
};

export default useSearch;