// src/components/features/ContentRow.jsx
import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useStore from '../../store/store';
import { fetchMovies } from '../../services/omdbService';
import { openTrailerInNewTab } from '../../services/youtubeTrailerService';

/**
 * Displays a horizontal scrollable row of content
 * Supports both predefined content and dynamic loading via search term
 */
const ContentRow = ({
    title,
    searchTerm = null,
    contentItems = null,
    isRecommended = false,
    isCollaborative = false
}) => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { trackInteraction } = useStore();

    // Fetch movies if searchTerm is provided
    useEffect(() => {
        // Skip fetch if we already have contentItems provided
        if (!searchTerm || contentItems) return;

        const getMovies = async () => {
            setIsLoading(true);
            try {
                const fetchedMovies = await fetchMovies(searchTerm);
                // Transform data to expected format for consistency
                const transformed = fetchedMovies.map(movie => ({
                    id: movie.imdbID,
                    title: movie.Title,
                    poster: movie.Poster !== 'N/A' ? movie.Poster : null,
                    thumbnail: movie.Poster !== 'N/A' ? movie.Poster : null,
                    year: movie.Year
                }));
                setMovies(transformed);
            } catch (error) {
                console.error(`Error fetching ${title} movies:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        getMovies();
    }, [searchTerm, title, contentItems]);

    // Memoize display items to prevent unnecessary re-renders
    const displayItems = useMemo(() =>
        contentItems || movies,
        [contentItems, movies]
    );

    // Navigate to movie details page
    const handleItemClick = (contentId) => {
        trackInteraction(contentId, 'click');
        navigate(`/watch/${contentId}`);
    };

    // Open trailer in new tab
    const handleTrailerClick = (event, movie) => {
        event.stopPropagation();
        trackInteraction(movie.id, 'trailer');
        openTrailerInNewTab(movie);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="netflix-row relative">
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h2>
                <div className="flex space-x-2 overflow-x-hidden py-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex-shrink-0 w-36 md:w-48 h-52 md:h-64 bg-gray-700 animate-pulse rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    // No content state - return null to avoid empty spaces
    if (!displayItems || displayItems.length === 0) {
        return null;
    }

    return (
        <div className="netflix-row relative mb-8">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                {title}
                {isRecommended && (
                    <span className="ml-2 text-sm text-netflix-red font-normal">
                        • Recommended for you
                    </span>
                )}
                {isCollaborative && (
                    <span className="ml-2 text-sm text-blue-400 font-normal">
                        • Based on similar viewers
                    </span>
                )}
            </h2>

            <div className="relative">
                <div className="overflow-hidden">
                    <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-4 no-scrollbar">
                        {displayItems.map((item) => (
                            <div
                                key={item.id}
                                className="netflix-card flex-shrink-0 cursor-pointer w-36 md:w-48"
                                onClick={() => handleItemClick(item.id)}
                            >
                                {/* Fixed height container for image */}
                                <div className="h-52 md:h-64 relative overflow-hidden">
                                    {(item.thumbnail || item.poster) ? (
                                        <img
                                            src={item.thumbnail || item.poster}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                const parent = e.target.parentNode;
                                                const div = document.createElement('div');
                                                div.className = "w-full h-full bg-netflix-dark flex items-center justify-center text-white";
                                                div.innerHTML = `<span class="text-2xl font-bold">${item.title ? item.title.charAt(0).toUpperCase() : 'M'}</span>`;
                                                parent.replaceChild(div, e.target);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-gray-500">
                                                {item.title ? item.title.charAt(0) : 'M'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Trailer button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-60">
                                        <button
                                            className="px-3 py-1 bg-netflix-red text-white rounded-full text-sm font-medium"
                                            onClick={(e) => handleTrailerClick(e, item)}
                                        >
                                            Watch Trailer
                                        </button>
                                    </div>
                                </div>

                                {/* Fixed height container for title */}
                                <div className="h-14 p-2 flex flex-col justify-center">
                                    <div className="text-sm text-gray-300 truncate">{item.title}</div>
                                    {item.year && (
                                        <div className="text-xs text-gray-400">{item.year}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

ContentRow.propTypes = {
    title: PropTypes.string.isRequired,
    searchTerm: PropTypes.string,
    contentItems: PropTypes.array,
    isRecommended: PropTypes.bool,
    isCollaborative: PropTypes.bool
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ContentRow);