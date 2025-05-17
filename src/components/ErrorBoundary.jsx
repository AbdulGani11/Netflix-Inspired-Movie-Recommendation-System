// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error boundary component to gracefully handle rendering errors
 * Prevents the entire app from crashing when a component fails
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-netflix-black flex items-center justify-center">
                    <div className="bg-netflix-dark p-6 rounded-lg max-w-md">
                        <h2 className="text-white text-2xl mb-4">Something went wrong</h2>
                        <p className="text-gray-400 mb-4">
                            An error occurred while rendering this content.
                        </p>
                        <button
                            className="netflix-button"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
};

export default ErrorBoundary;