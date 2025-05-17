// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Details from './pages/Details';
import Profile from './pages/Profile';

// Create a React Query client with optimized settings
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 300000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/browse" element={<Browse />} />
                        <Route path="/watch/:id" element={<Details />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<Home />} /> {/* Fallback to Home */}
                    </Routes>
                </Router>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;