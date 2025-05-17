// src/services/recommendation.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Recommendation Engine for Netflix clone
 * 
 * Implements both collaborative filtering and content-based filtering algorithms
 * to provide personalized movie recommendations similar to Netflix's approach.
 * 
 * This is a simplified implementation designed to demonstrate the core concepts
 * that power recommendation systems in streaming platforms.
 */
class RecommendationEngine {
    constructor() {
        this.contentItems = []; // All content items
        this.userProfiles = []; // All user profiles
        this.interactionMatrix = {}; // User-item interaction matrix
        this.contentFeatures = {}; // Content feature vectors
        this.initialized = false;
        this.model = null; // Model for collaborative filtering
    }

    /**
     * Initialize the recommendation engine with data
     * Loads content, profiles, and interaction data from Firestore
     */
    async initialize() {
        try {
            // Don't re-initialize if already done
            if (this.initialized) {
                return;
            }

            // Load content items
            const contentRef = collection(db, 'content');
            const contentSnapshot = await getDocs(contentRef);
            this.contentItems = contentSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load user profiles
            const profilesRef = collection(db, 'profiles');
            const profilesSnapshot = await getDocs(profilesRef);
            this.userProfiles = profilesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load interactions
            const interactionsRef = collection(db, 'interactions');
            const interactionsSnapshot = await getDocs(interactionsRef);
            const interactions = interactionsSnapshot.docs.map(doc => doc.data());

            // Process interactions into a matrix
            this.processInteractions(interactions);

            // Generate content feature vectors
            this.generateContentFeatures();

            // Initialize collaborative filtering model
            await this.initializeModel();

            this.initialized = true;
            console.log('Recommendation engine initialized');
        } catch (error) {
            console.error('Error initializing recommendation engine:', error);
            throw error;
        }
    }

    /**
     * Process user-item interactions into a matrix
     * This creates a matrix of user-item interactions for collaborative filtering
     * 
     * @param {Array} interactions - User interactions data
     */
    processInteractions(interactions) {
        this.interactionMatrix = {};

        // Initialize empty matrix
        this.userProfiles.forEach(profile => {
            this.interactionMatrix[profile.id] = {};
            this.contentItems.forEach(item => {
                this.interactionMatrix[profile.id][item.id] = 0;
            });
        });

        // Fill matrix with interaction data
        interactions.forEach(interaction => {
            const { profileId, contentId, type } = interaction;

            // Skip if profile or content doesn't exist in our matrix
            if (!this.interactionMatrix[profileId] || !this.contentItems.find(item => item.id === contentId)) {
                return;
            }

            // Weight different interaction types
            let weight = 0;
            switch (type) {
                case 'view':
                    weight = 1;
                    break;
                case 'complete':
                    weight = 3;
                    break;
                case 'like':
                    weight = 5;
                    break;
                case 'dislike':
                    weight = -5;
                    break;
                default:
                    weight = 0.5;
            }

            // Update interaction strength
            this.interactionMatrix[profileId][contentId] += weight;
        });
    }

    /**
     * Generate feature vectors for all content items
     * Creates normalized feature vectors for content-based filtering
     */
    generateContentFeatures() {
        this.contentFeatures = {};

        this.contentItems.forEach(item => {
            const features = {
                // Generate normalized genre vector
                genres: this.normalizeGenres(item.genres || []),

                // Normalize release year to 0-1 range (assuming content from 1950-2025)
                year: item.year ? (item.year - 1950) / 75 : 0.5,

                // Content type (movie = 0, series = 1)
                type: item.type === 'series' ? 1 : 0,

                // Popularity score (normalized to 0-1)
                popularity: item.popularity || 0.5,

                // Average rating (normalized to 0-1)
                rating: item.rating ? item.rating / 10 : 0.5
            };

            this.contentFeatures[item.id] = features;
        });
    }

    /**
     * Normalize genre vector for content-based filtering
     * 
     * @param {Array} genres - Content genres
     * @returns {Object} - Normalized genre vector
     */
    normalizeGenres(genres) {
        // Get all unique genres across all content
        const allGenres = Array.from(new Set(
            this.contentItems.flatMap(item => item.genres || [])
        ));

        // Create a binary vector for genres
        const genreVector = {};
        allGenres.forEach(genre => {
            genreVector[genre] = genres.includes(genre) ? 1 : 0;
        });

        return genreVector;
    }

    /**
     * Initialize model for collaborative filtering
     * In a real implementation, this would use TensorFlow.js or a similar library
     */
    async initializeModel() {
        try {
            // For demo purposes, we use a simulated model
            // In production, this would be a proper machine learning model
            this.model = {
                predict: (userId, itemId) => {
                    // Simple prediction based on interaction matrix
                    return this.interactionMatrix[userId]?.[itemId] || 0;
                }
            };

            console.log('Model initialized (simplified version)');
        } catch (error) {
            console.error('Error initializing model:', error);
        }
    }

    /**
     * Get personalized recommendations for a user
     * Uses both collaborative and content-based filtering
     * 
     * @param {string} profileId - User profile ID
     * @param {number} count - Number of recommendations to return
     * @returns {Array} - Recommended content items
     */
    async getPersonalizedRecommendations(profileId, count = 10) {
        if (!this.initialized) {
            await this.initialize();
        }

        const profile = this.userProfiles.find(p => p.id === profileId);
        if (!profile) {
            throw new Error(`Profile with ID ${profileId} not found`);
        }

        // Get user's watch history
        const watchHistory = Object.entries(this.interactionMatrix[profileId] || {})
            .filter(([, value]) => value > 0)
            .map(([contentId]) => contentId);

        // Calculate scores for all items
        const scoredItems = this.contentItems
            // Filter out already watched items
            .filter(item => !watchHistory.includes(item.id))
            // Calculate hybrid score (collaborative + content-based)
            .map(item => {
                // Collaborative filtering score
                const collaborativeScore = this.getCollaborativeScore(profileId, item.id);

                // Content-based score
                const contentScore = this.getContentBasedScore(profile, item);

                // Combine scores (with weighting)
                const hybridScore = (collaborativeScore * 0.7) + (contentScore * 0.3);

                return {
                    ...item,
                    score: hybridScore
                };
            })
            // Sort by score (highest first)
            .sort((a, b) => b.score - a.score)
            // Take requested number of items
            .slice(0, count);

        return scoredItems;
    }

    /**
     * Get collaborative filtering score for user-item pair
     * 
     * @param {string} profileId - User profile ID
     * @param {string} contentId - Content ID
     * @returns {number} - Collaborative filtering score
     */
    getCollaborativeScore(profileId, contentId) {
        // Find similar users
        const userSimilarities = this.findSimilarUsers(profileId);

        // Calculate weighted score based on similar users' interactions
        let score = 0;
        let totalSimilarity = 0;

        userSimilarities.forEach(({ id, similarity }) => {
            const userInteraction = this.interactionMatrix[id]?.[contentId] || 0;
            score += userInteraction * similarity;
            totalSimilarity += similarity;
        });

        // Normalize score
        return totalSimilarity > 0 ? score / totalSimilarity : 0;
    }

    /**
     * Find users similar to the given user based on interaction patterns
     * 
     * @param {string} profileId - User profile ID
     * @returns {Array} - Similar users with similarity scores
     */
    findSimilarUsers(profileId) {
        const targetUser = this.interactionMatrix[profileId];
        if (!targetUser) {
            return [];
        }

        // Calculate similarity with all other users
        return this.userProfiles
            .filter(profile => profile.id !== profileId)
            .map(profile => {
                const otherUser = this.interactionMatrix[profile.id];
                const similarity = this.calculateUserSimilarity(targetUser, otherUser);

                return {
                    id: profile.id,
                    similarity
                };
            })
            .filter(({ similarity }) => similarity > 0)
            .sort((a, b) => b.similarity - a.similarity);
    }

    /**
     * Calculate similarity between two users based on their interactions (cosine similarity)
     * 
     * @param {Object} user1 - First user's interaction vector
     * @param {Object} user2 - Second user's interaction vector
     * @returns {number} - Similarity score (0-1)
     */
    calculateUserSimilarity(user1, user2) {
        // Implement cosine similarity between user vectors
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        // Calculate dot product and norms
        Object.keys(user1).forEach(itemId => {
            if (user2[itemId]) {
                dotProduct += user1[itemId] * user2[itemId];
            }
            norm1 += user1[itemId] * user1[itemId];
        });

        Object.keys(user2).forEach(itemId => {
            norm2 += user2[itemId] * user2[itemId];
        });

        // Calculate cosine similarity
        const normProduct = Math.sqrt(norm1) * Math.sqrt(norm2);
        return normProduct > 0 ? dotProduct / normProduct : 0;
    }

    /**
     * Get content-based filtering score based on user preferences and content attributes
     * 
     * @param {Object} profile - User profile
     * @param {Object} content - Content item
     * @returns {number} - Content-based score
     */
    getContentBasedScore(profile, content) {
        // Calculate score based on genre preferences
        const userGenres = profile.preferences?.genres || [];
        const contentGenres = content.genres || [];

        // Genre match score (percentage of content genres that match preferred genres)
        const genreMatches = contentGenres.filter(genre => userGenres.includes(genre)).length;
        const genreScore = contentGenres.length > 0 ? genreMatches / contentGenres.length : 0;

        // Age relevance (prioritize newer content slightly)
        const yearScore = content.year ? Math.min((content.year - 2000) / 25, 1) : 0.5;

        // Popularity score
        const popularityScore = content.popularity || 0.5;

        // Combined score with weights
        return (genreScore * 0.6) + (yearScore * 0.1) + (popularityScore * 0.3);
    }

    /**
     * Get similar content recommendations
     * Finds content similar to a reference item
     * 
     * @param {string} contentId - Base content ID
     * @param {number} count - Number of recommendations to return
     * @returns {Array} - Similar content items
     */
    async getSimilarContent(contentId, count = 10) {
        if (!this.initialized) {
            await this.initialize();
        }

        const baseContent = this.contentItems.find(item => item.id === contentId);
        if (!baseContent) {
            throw new Error(`Content with ID ${contentId} not found`);
        }

        // Calculate similarity scores for all other items
        const similarItems = this.contentItems
            .filter(item => item.id !== contentId) // Exclude the base content
            .map(item => {
                const similarity = this.calculateContentSimilarity(baseContent, item);
                return {
                    ...item,
                    score: similarity
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, count);

        return similarItems;
    }

    /**
     * Calculate similarity between two content items
     * 
     * @param {Object} content1 - First content item
     * @param {Object} content2 - Second content item
     * @returns {number} - Similarity score (0-1)
     */
    calculateContentSimilarity(content1, content2) {
        // Genre similarity (Jaccard similarity)
        const genres1 = content1.genres || [];
        const genres2 = content2.genres || [];

        const genreIntersection = genres1.filter(genre => genres2.includes(genre)).length;
        const genreUnion = new Set([...genres1, ...genres2]).size;
        const genreSimilarity = genreUnion > 0 ? genreIntersection / genreUnion : 0;

        // Year similarity (normalized absolute difference)
        const yearDiff = content1.year && content2.year
            ? Math.abs(content1.year - content2.year) / 50 // Normalize by 50 years
            : 0.5;
        const yearSimilarity = 1 - Math.min(yearDiff, 1);

        // Type similarity (exact match)
        const typeSimilarity = content1.type === content2.type ? 1 : 0;

        // Combined similarity with weights
        return (genreSimilarity * 0.6) + (yearSimilarity * 0.3) + (typeSimilarity * 0.1);
    }
}

// Export singleton instance for consistent state across imports
const recommendationEngine = new RecommendationEngine();
export default recommendationEngine;