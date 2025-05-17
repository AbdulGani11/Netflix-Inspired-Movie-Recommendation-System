// src/components/ui/MovieThumbnail.jsx
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Reusable movie thumbnail component with built-in error handling
 * Used in content rows and search results
 */
const MovieThumbnail = ({ movie, onClick, onTrailerClick, showTrailerButton = true }) => {
    // Handle trailer button click while preventing navigation
    const handleTrailerClick = (e) => {
        e.stopPropagation();
        onTrailerClick(movie);
    };

    return (
        <motion.div
            className="netflix-card flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => onClick(movie.id)}
        >
            <div className="h-52 md:h-64 relative">
                {(movie.thumbnail || movie.poster) ? (
                    <img
                        src={movie.thumbnail || movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            const parent = e.target.parentNode;
                            const div = document.createElement('div');
                            div.className = "w-full h-full bg-netflix-dark flex items-center justify-center text-white";
                            div.innerHTML = `<span class="text-2xl font-bold">${movie.title ? movie.title.charAt(0).toUpperCase() : 'M'}</span>`;
                            parent.replaceChild(div, e.target);
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-500">
                            {movie.title ? movie.title.charAt(0) : 'M'}
                        </span>
                    </div>
                )}

                {/* Trailer button overlay - shown conditionally */}
                {showTrailerButton && onTrailerClick && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-60">
                        <button
                            className="px-3 py-1 bg-netflix-red text-white rounded-full text-sm font-medium"
                            onClick={handleTrailerClick}
                        >
                            Watch Trailer
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-2 text-sm text-gray-300 truncate px-1">{movie.title}</div>
            {movie.year && (
                <div className="text-xs text-gray-400 px-1">{movie.year}</div>
            )}
        </motion.div>
    );
};

MovieThumbnail.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        poster: PropTypes.string,
        thumbnail: PropTypes.string,
        year: PropTypes.string
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    onTrailerClick: PropTypes.func,
    showTrailerButton: PropTypes.bool
};

export default MovieThumbnail;