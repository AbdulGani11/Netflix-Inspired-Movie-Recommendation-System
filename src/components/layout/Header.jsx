// src/components/layout/Header.jsx
import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/store';
import SearchBar from '../ui/SearchBar';

/**
 * Netflix-style header component
 * Features conditional background, navigation, search bar, and profile menu
 */
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { currentProfile, profiles, setCurrentProfile } = useStore();
    const navigate = useNavigate();

    // Change header background on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        // Add event listener with passive option for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Clean up event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProfileChange = (profileId) => {
        setCurrentProfile(profileId);
    };

    return (
        <header
            className={`fixed top-0 z-50 w-full px-4 py-4 flex items-center transition-colors duration-300 ${isScrolled ? 'bg-netflix-black' : 'bg-transparent'
                }`}
        >
            {/* Logo - Aligned to the left */}
            <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                    <img
                        src="/netflix-logo.png"
                        alt="Netflix"
                        className="h-8 md:h-10"
                    />
                </Link>
            </div>

            {/* Navigation, Profile & Search - All centered together */}
            <div className="flex-grow flex justify-center items-center space-x-8">
                {/* Navigation link */}
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>

                {/* Search Bar */}
                <SearchBar />

                {/* Profile Menu - with accessible dropdown */}
                <div className="relative group">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center space-x-2"
                        aria-label="Profile menu"
                        aria-haspopup="true"
                    >
                        {currentProfile?.avatar ? (
                            <img
                                src={currentProfile.avatar}
                                alt={`${currentProfile.name}'s avatar`}
                                className="w-8 h-8 rounded"
                                onError={(e) => {
                                    e.target.onError = null;
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center text-white">
                                {currentProfile?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <span className="text-white text-sm hidden md:inline">{currentProfile?.name || 'User'}</span>
                    </button>

                    {/* Dropdown menu */}
                    <div
                        className="absolute right-0 mt-2 w-48 bg-netflix-dark rounded shadow-lg py-1 invisible group-hover:visible transition-all duration-300"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="profile-menu"
                    >
                        {profiles.map(profile => (
                            <button
                                key={profile.id}
                                className="w-full text-left px-4 py-2 text-white hover:bg-netflix-black flex items-center"
                                onClick={() => handleProfileChange(profile.id)}
                                role="menuitem"
                            >
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={`${profile.name}'s avatar`}
                                        className="w-6 h-6 rounded mr-2"
                                        onError={(e) => {
                                            e.target.onError = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center text-white mr-2">
                                        {profile.name.charAt(0)}
                                    </div>
                                )}
                                {profile.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(Header);