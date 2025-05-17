// src/pages/Details.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import useMovieDetails from '../hooks/useMovieDetails';
import useStore from '../store/store';
import { openTrailerInNewTab } from '../services/youtubeTrailerService';

/**
 * Movie details page component
 * Displays detailed information about a selected movie
 */
const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentProfile, trackInteraction } = useStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const { movie, isLoading, error } = useMovieDetails(id);

    // Redirect to profile selection if no profile is selected
    useEffect(() => {
        if (!currentProfile) {
            navigate('/profile');
        }
    }, [currentProfile, navigate]);

    // Handle play button click
    const handlePlay = () => {
        setIsPlaying(true);
        trackInteraction(id, 'play');
    };

    // Handle trailer button click
    const handleTrailerClick = () => {
        trackInteraction(id, 'trailer');
        if (movie) {
            openTrailerInNewTab(movie);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-netflix-black">
                <Header />
                <div className="pt-20 flex justify-center items-center">
                    <div className="animate-pulse text-netflix-red text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !movie) {
        return (
            <div className="min-h-screen bg-netflix-black">
                <Header />
                <div className="pt-20 flex flex-col justify-center items-center px-4">
                    <h1 className="text-white text-2xl mb-4">
                        {error || "Content Not Found"}
                    </h1>
                    <button
                        className="netflix-button"
                        onClick={() => navigate('/browse')}
                    >
                        Back to Browse
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-netflix-black">
            <Header />

            {/* Video Player (when playing) */}
            {isPlaying ? (
                <div className="pt-16 h-screen w-full bg-black">
                    <div className="relative h-full w-full flex flex-col justify-center items-center">
                        <div className="text-white text-center mb-8">
                            <div className="text-4xl mb-2">▶️</div>
                            <div className="text-xl">{movie.title} - Now Playing</div>
                            <div className="text-gray-400 mt-1">
                                (This is a demo - no actual video will play)
                            </div>
                        </div>

                        <button
                            className="netflix-button mt-4"
                            onClick={() => setIsPlaying(false)}
                        >
                            Back to Details
                        </button>
                    </div>
                </div>
            ) : (
                /* Content Details */
                <div className="pt-16 px-4 md:px-8 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mt-8">
                        {/* Poster */}
                        <div className="md:w-1/3">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full rounded shadow-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;
                                }}
                            />
                        </div>

                        {/* Details */}
                        <div className="md:w-2/3">
                            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                            <p className="text-netflix-red mb-4">{movie.year} • {movie.rating} • {movie.duration}</p>

                            <div className="flex mb-6 space-x-4">
                                <button
                                    className="netflix-button flex items-center"
                                    onClick={handlePlay}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Play
                                </button>

                                <button
                                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition-colors flex items-center"
                                    onClick={handleTrailerClick}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Watch Trailer
                                </button>
                            </div>

                            <p className="text-white mb-6">{movie.description}</p>

                            <div className="text-sm mb-2">
                                <span className="text-gray-400">Genre: </span>
                                <span className="text-white">{movie.genres.join(', ')}</span>
                            </div>

                            <div className="text-sm mb-2">
                                <span className="text-gray-400">Director: </span>
                                <span className="text-white">{movie.director}</span>
                            </div>

                            <div className="text-sm">
                                <span className="text-gray-400">Cast: </span>
                                <span className="text-white">{movie.cast.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Details;