// src/components/ui/ContentSkeleton.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Loading skeleton component for content rows
 * Displays animated placeholder elements while content is loading
 */
const ContentSkeleton = ({ count = 6, showTitle = true, className = '' }) => {
    // Create an array of the specified length for mapping
    const items = Array.from({ length: count }, (_, index) => index);

    return (
        <div className={`netflix-row relative ${className}`}>
            {/* Title placeholder */}
            {showTitle && (
                <div className="h-7 w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
            )}

            {/* Content placeholders */}
            <div className="flex space-x-4 overflow-x-hidden py-4">
                {items.map((index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-36 md:w-48 h-52 md:h-64 bg-gray-800 rounded animate-pulse"
                    ></div>
                ))}
            </div>
        </div>
    );
};

ContentSkeleton.propTypes = {
    count: PropTypes.number,
    showTitle: PropTypes.bool,
    className: PropTypes.string
};

// Memoize to prevent unnecessary re-renders
export default memo(ContentSkeleton);