// src/pages/Home.jsx
import { useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/store';

/**
 * Home page component
 * Displays profile selection and information about the recommendation system
 */
const Home = () => {
    const navigate = useNavigate();
    const { profiles, setCurrentProfile } = useStore();

    // Memoized profile selection handler to prevent recreating on each render
    const handleProfileSelect = useCallback((profileId) => {
        setCurrentProfile(profileId);
        navigate('/browse');
    }, [setCurrentProfile, navigate]);

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const profileVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        }
    };

    // Color mapping for profile avatars - moved outside JSX for clarity
    const getProfileColor = (profileId) => {
        const colorMap = {
            '1': 'bg-red-700',      // Action Fan - intense red
            '2': 'bg-yellow-600',   // Comedy Lover - vibrant gold
            '3': 'bg-indigo-700'    // Drama Enthusiast - rich purple
        };

        return colorMap[profileId] || 'bg-gray-600';
    };

    return (
        <div className="min-h-screen bg-netflix-black">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <img
                    src="/netflix-logo.png"
                    alt="Netflix Clone Logo"
                    className="h-8 md:h-10"
                />
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-8">
                {/* Title Section */}
                <div className="text-center my-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Netflix-Inspired Movie Recommendations
                    </h1>
                    <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base">
                        This project demonstrates how streaming services like Netflix use recommendation algorithms to help viewers discover relevant content.
                    </p>
                </div>

                {/* Who's Watching Section */}
                <section aria-labelledby="profiles-heading" className="text-center mb-8">
                    <h2 id="profiles-heading" className="text-2xl text-white font-bold mb-6">Who&apos;s watching?</h2>

                    <motion.div
                        className="flex flex-wrap justify-center gap-6 md:gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        role="list"
                        aria-label="User profiles"
                    >
                        {profiles.map((profile) => (
                            <motion.div
                                key={profile.id}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => handleProfileSelect(profile.id)}
                                variants={profileVariants}
                                whileHover="hover"
                                role="listitem"
                                aria-label={`Select ${profile.name} profile`}
                            >
                                <div className={`w-20 h-20 md:w-24 md:h-24 mb-3 flex items-center justify-center text-white text-3xl font-light ${getProfileColor(profile.id)}`}>
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-300 text-sm">
                                    {profile.name}
                                </span>
                                {profile.preferences?.genres?.length > 0 && (
                                    <span className="text-xs text-gray-500 mt-1">
                                        Likes: {profile.preferences.genres.slice(0, 2).join(', ')}
                                    </span>
                                )}
                            </motion.div>
                        ))}

                        {/* Add Profile button - disabled in demo */}
                        <motion.div
                            className="flex flex-col items-center cursor-not-allowed opacity-50"
                            variants={profileVariants}
                            whileHover="hover"
                            role="listitem"
                            aria-label="Add profile (disabled in demo)"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 mb-3 bg-gray-800 border border-gray-600 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="text-gray-400 text-sm">Add Profile</span>
                        </motion.div>
                    </motion.div>
                </section>

                {/* About the Recommendation System */}
                <section aria-labelledby="about-heading" className="max-w-3xl mx-auto border border-gray-800 bg-black bg-opacity-50 rounded p-5 mb-8">
                    <h3 id="about-heading" className="text-xl text-white mb-3">About the Recommendation System</h3>
                    <p className="text-gray-300 text-sm mb-4">
                        This project demonstrates three recommendation approaches used by Netflix and similar streaming services:
                    </p>

                    <ul className="text-gray-300 text-sm space-y-4 pl-5 mb-4">
                        <li className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2" aria-hidden="true"></span>
                            <div>
                                <span className="font-bold text-blue-400">Collaborative Filtering:</span>
                                <p className="mt-1">Used by Netflix to suggest &quot;Because You Watched...&quot; content. Look for the <span className="text-blue-400 font-semibold">&quot;Popular With Similar Viewers&quot;</span> section with the blue label.</p>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 bg-netflix-red rounded-full mt-1.5 mr-2" aria-hidden="true"></span>
                            <div>
                                <span className="font-bold text-netflix-red">Content-Based Filtering:</span>
                                <p className="mt-1">Netflix uses this to recommend content based on genres you enjoy. Check out <span className="text-netflix-red font-semibold">&quot;Top Picks for [Profile Name]&quot;</span> with the red label.</p>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2" aria-hidden="true"></span>
                            <div>
                                <span className="font-bold">Hybrid Approach:</span>
                                <p className="mt-1">Netflix combines multiple recommendation methods for better results. This system combines both approaches, weighing collaborative signals (70%) and content preferences (30%).</p>
                            </div>
                        </li>
                    </ul>

                    <div className="mt-5 bg-gray-900 bg-opacity-50 p-3 rounded border border-gray-700">
                        <p className="text-gray-200 text-sm font-semibold">How to test it:</p>
                        <ol className="text-gray-300 text-sm list-decimal pl-5 mt-2 space-y-1">
                            <li>Switch between different profiles (each has unique genre preferences)</li>
                            <li>Notice how &quot;Top Picks&quot; changes based on each profile&apos;s genres</li>
                            <li>See how &quot;Popular With Similar Viewers&quot; shows content different from your preferences</li>
                            <li>Watch a few items to see your &quot;Continue Watching&quot; section populate</li>
                        </ol>
                    </div>

                    <p className="text-gray-400 text-sm italic mt-4">
                        This project is for educational purposes only and is not affiliated with Netflix.
                    </p>
                </section>
            </div>
        </div>
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(Home);