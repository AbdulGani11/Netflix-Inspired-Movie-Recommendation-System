// src/components/features/SearchResults.jsx
import PropTypes from 'prop-types';
import MovieThumbnail from '../ui/MovieThumbnail';

/**
 * Displays search results in a grid layout
 */
const SearchResults = ({ query, results, onMovieClick, onTrailerClick }) => {
    if (!results || results.length === 0) {
        return (
            <div className="pt-4">
                <h2 className="text-2xl text-white mb-4">No results found for &quot;{query}&quot;</h2>
                <p className="text-gray-400">Try searching for a different title, actor, or genre.</p>
            </div>
        );
    }

    return (
        <div className="pt-4">
            <h2 className="text-2xl text-white mb-4">Search results for &quot;{query}&quot;</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map(movie => (
                    <MovieThumbnail
                        key={movie.imdbID}
                        movie={{
                            id: movie.imdbID,
                            title: movie.Title,
                            poster: movie.Poster !== 'N/A' ? movie.Poster : null,
                            year: movie.Year
                        }}
                        onClick={onMovieClick}
                        onTrailerClick={onTrailerClick}
                    />
                ))}
            </div>
        </div>
    );
};

SearchResults.propTypes = {
    query: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    onMovieClick: PropTypes.func.isRequired,
    onTrailerClick: PropTypes.func
};

export default SearchResults;