// src/store/store.js
import { create } from 'zustand';

/**
 * Netflix-inspired state management using Zustand
 * Organized into logical slices for better maintainability
 */

// Create store with user profile and viewing history
const useStore = create((set) => ({
    // -------------------- 
    // PROFILES SLICE
    // --------------------
    // Current user/profile state
    currentProfile: null,
    profiles: [
        {
            id: '1',
            name: 'Action Fan',
            avatar: '/avatars/1.png',
            preferences: { genres: ['action', 'thriller'] },
            viewingHistory: []
        },
        {
            id: '2',
            name: 'Comedy Lover',
            avatar: '/avatars/2.png',
            preferences: { genres: ['comedy', 'romance'] },
            viewingHistory: []
        },
        {
            id: '3',
            name: 'Drama Enthusiast',
            avatar: '/avatars/3.png',
            preferences: { genres: ['drama', 'documentary'] },
            viewingHistory: []
        },
    ],

    // Set the active user profile
    setCurrentProfile: (profileId) =>
        set((state) => ({
            currentProfile: state.profiles.find(profile => profile.id === profileId)
        })),

    // -------------------- 
    // VIEWING HISTORY SLICE
    // --------------------
    // Global viewing history (maintained for backward compatibility)
    viewingHistory: [],

    // Add content to viewing history (for both profile-specific and global history)
    addToHistory: (contentItem) =>
        set((state) => {
            // If no profile is selected, do nothing
            if (!state.currentProfile) {
                return {};
            }

            // Find current profile index
            const profileIndex = state.profiles.findIndex(
                profile => profile.id === state.currentProfile.id
            );

            if (profileIndex === -1) {
                return {}; // Profile not found, do nothing
            }

            // Clone profiles array to avoid direct state mutation
            const updatedProfiles = [...state.profiles];

            // Get current profile's viewing history
            const profileHistory = [...(updatedProfiles[profileIndex].viewingHistory || [])];

            // Check if item already exists in this profile's history
            const existingIndex = profileHistory.findIndex(item => item.id === contentItem.id);

            if (existingIndex >= 0) {
                // Update existing entry with new timestamp and progress
                profileHistory[existingIndex] = {
                    ...profileHistory[existingIndex],
                    timestamp: new Date().toISOString(),
                    progress: contentItem.progress || profileHistory[existingIndex].progress
                };
            } else {
                // Add new entry to the beginning of history
                profileHistory.unshift(contentItem);
            }

            // Limit to last 100 items
            updatedProfiles[profileIndex].viewingHistory = profileHistory.slice(0, 100);

            // Also update the global viewingHistory for backward compatibility
            let globalHistory;
            const globalExistingIndex = state.viewingHistory.findIndex(item => item.id === contentItem.id);

            if (globalExistingIndex >= 0) {
                // Update existing entry
                globalHistory = [...state.viewingHistory];
                globalHistory[globalExistingIndex] = {
                    ...globalHistory[globalExistingIndex],
                    timestamp: new Date().toISOString(),
                    progress: contentItem.progress || globalHistory[globalExistingIndex].progress
                };
            } else {
                // Add new entry
                globalHistory = [contentItem, ...state.viewingHistory];
            }

            return {
                profiles: updatedProfiles,
                viewingHistory: globalHistory.slice(0, 100)
            };
        }),

    // -------------------- 
    // INTERACTION TRACKING SLICE
    // --------------------
    // Track user interactions with content for recommendation engine
    trackInteraction: (contentId, interactionType, duration = null) => {
        // Create interaction object with metadata
        const interaction = {
            contentId,
            type: interactionType, // play, pause, complete, etc.
            duration,
            timestamp: new Date().toISOString(),
        };

        console.log('Tracked interaction:', interaction);
        // In a production app, this would send data to backend:
        // api.trackInteraction(contentId, currentProfile?.id, interactionType, { duration });
    }
}));

export default useStore;