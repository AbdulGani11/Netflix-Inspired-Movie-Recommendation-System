// src/components/ui/SearchBar.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/store';
import useSearch from '../../hooks/useSearch';

/**
 * Netflix-style search bar with autocomplete dropdown
 * Uses custom useSearch hook for search functionality
 */
const SearchBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { trackInteraction } = useStore();
    const {
        query,
        setQuery,
        results,
        isSearching,
        hasResults
    } = useSearch();

    // Reset search when route changes
    useEffect(() => {
        setIsExpanded(false);
        setQuery('');
    }, [location.pathname, setQuery]);

    // Focus input when expanded
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    const handleToggleSearch = () => {
        setIsExpanded(!isExpanded);
        if (isExpanded) {
            setQuery('');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            trackInteraction('search', 'query', { query });
            navigate(`/browse?query=${encodeURIComponent(query.trim())}`);
            setIsExpanded(false);
        }
    };

    const handleResultClick = (movie) => {
        trackInteraction(movie.imdbID, 'search_click');
        navigate(`/watch/${movie.imdbID}`);
        setIsExpanded(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center">
                <button
                    className="text-white p-2"
                    onClick={handleToggleSearch}
                    aria-label={isExpanded ? "Close search" : "Open search"}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.form
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="flex"
                            onSubmit={handleSearch}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Titles, people, genres"
                                className="bg-black bg-opacity-70 text-white border border-gray-600 rounded px-3 py-1 w-full focus:outline-none focus:border-netflix-red"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Search for movies, TV shows, people"
                            />
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Results Dropdown */}
            {isExpanded && query && (
                <div className="absolute right-0 mt-2 w-60 bg-netflix-dark rounded shadow-lg z-50">
                    {isSearching ? (
                        <div className="p-3 text-center text-gray-400">
                            <div className="animate-pulse">Searching...</div>
                        </div>
                    ) : hasResults ? (
                        <ul role="listbox">
                            {results.slice(0, 5).map(movie => (
                                <li
                                    key={movie.imdbID}
                                    className="border-b border-gray-800 last:border-b-0 hover:bg-netflix-black cursor-pointer"
                                    onClick={() => handleResultClick(movie)}
                                    role="option"
                                >
                                    <div className="flex items-center p-2">
                                        {movie.Poster && movie.Poster !== 'N/A' ? (
                                            <img
                                                src={movie.Poster}
                                                alt={movie.Title}
                                                className="w-10 h-14 object-cover mr-2"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://via.placeholder.com/45x63?text=${encodeURIComponent(movie.Title.charAt(0))}`;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-10 h-14 bg-gray-800 flex items-center justify-center mr-2 text-sm">
                                                {movie.Title.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <div className="text-white text-sm font-medium truncate">{movie.Title}</div>
                                            <div className="text-gray-400 text-xs">{movie.Year}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <li className="p-2 text-center">
                                <button
                                    className="text-netflix-red text-sm hover:underline"
                                    onClick={handleSearch}
                                >
                                    See all results
                                </button>
                            </li>
                        </ul>
                    ) : query.length >= 2 ? (
                        <div className="p-3 text-center text-gray-400">
                            No results found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SearchBar;