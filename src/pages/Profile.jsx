// src/pages/Profile.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';

/**
 * Profile component handles redirection logic
 * Redirects to home if no profile is selected or to browse if profile exists
 */
const Profile = () => {
    const { currentProfile } = useStore();
    const navigate = useNavigate();

    // Handle profile-based redirection on component mount
    useEffect(() => {
        // Redirect to browse if a profile is already selected
        if (currentProfile) {
            navigate('/browse');
        } else {
            // Redirect to home if no profile is selected
            navigate('/');
        }
    }, [currentProfile, navigate]);

    // This component doesn't render anything as it just handles redirects
    return null;
};

export default Profile;