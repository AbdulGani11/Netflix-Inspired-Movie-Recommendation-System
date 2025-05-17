# Netflix-Inspired Movie Recommendation System

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

A frontend React application that demonstrates recommendation techniques using a Netflix-inspired interface. This project showcases how streaming services like Netflix use different recommendation approaches to help viewers discover relevant content.

## UI
![UI](https://github.com/user-attachments/assets/ef2b999a-1581-4237-94b2-7ce0e6d77e16)



## User Profiles
![User profiles](https://github.com/user-attachments/assets/1b1b5174-9e6f-4d34-a790-c82735bd8864)



## Search functionlity
![Search functionlity](https://github.com/user-attachments/assets/a20c38ce-3177-4565-8732-9bd986cfb77f)



## Search result
![Search result](https://github.com/user-attachments/assets/f6dd7cfc-a8ec-46b7-854d-564e3fa5deaa)


## 💡 Project Purpose

This project serves multiple purposes:

- **Educational Resource**: Demonstrates how Netflix-like recommendation techniques work in practice
- **Portfolio Piece**: Showcases ability to implement complex UI patterns and state management
- **Technical Skills Showcase**: Highlights proficiency in React, custom hooks, state management, and responsive design

This project is intended for educational and portfolio purposes only and is not affiliated with Netflix.

### [✨ Live Demo](https://your-demo-link-here.com)

## 🎯 Features

### Recommendation System
- **Collaborative Filtering**: Suggests "Popular With Similar Viewers" content based on similar users' preferences
- **Content-Based Filtering**: Recommends "Top Picks for [User]" based on genre preferences
- **Hybrid Approach**: Combines both methods with weighted scoring (70% collaborative, 30% content-based)

### User Experience
- **Profile Selection**: Multiple user profiles with different genre preferences
- **Netflix-Style UI**: Clean, responsive interface with horizontal scrolling content rows
- **Content Discovery**: Category browsing, search functionality, and YouTube trailer previews
- **Viewing History**: Profile-specific "Continue Watching" sections

## 🛠️ Technology Stack

- **Frontend**: 
  - React 18 with hooks and functional components
  - React Router for navigation
  - Framer Motion for Netflix-like animations
  - Tailwind CSS for styling
  
- **State Management**:
  - Zustand for lightweight state management
  - TanStack Query (React Query) for data fetching

- **External Services**:
  - OMDb API for movie information and posters
  - Firebase/Firestore for backend data
  - MovieLens dataset for recommendation data

- **Build Tools**:
  - Vite for fast development and optimized builds
  - ESLint for code quality

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - OMDb API ([Get one here](https://www.omdbapi.com/apikey.aspx))
  - Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/netflix-inspired-recommendations.git
cd netflix-inspired-recommendations
```

2. **Install dependencies**
```bash
npm install
# or
yarn
```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
```
VITE_OMDB_API_KEY=your_omdb_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 📘 Usage Guide

### Testing the Recommendation System

1. **Start from the home page** and select one of the profile options:
   - "Action Fan" for action/thriller recommendations
   - "Comedy Lover" for comedy/romance recommendations 
   - "Drama Enthusiast" for drama/documentary recommendations

2. **Explore recommendations** on the browse page:
   - Notice how "Top Picks for [Profile]" changes based on the selected profile
   - The "Popular With Similar Viewers" section shows content different from your direct preferences (collaborative filtering)
   - Scroll through genre-based categories

3. **Click on a movie** to see its details page and:
   - View movie information
   - Click "Watch Trailer" to see the trailer on YouTube
   - Click "Play" to simulate watching (for demo purposes)

4. **Watch a few items** to see your "Continue Watching" section populate

5. **Try the search** functionality to find specific content

6. **Switch profiles** to see how recommendations change

## 📂 Project Structure

```
src/
├── components/          # UI components
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # External API services
├── store/               # State management
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

### Data Processing Pipeline

The project processes MovieLens dataset into Firebase Firestore:

- **Raw MovieLens Data**: CSV files containing movies, ratings, and IMDb links
- **Processing**: Transformation into structured JSON intermediates
- **Firebase Storage**: Organized collections for recommendation algorithms

### Firebase Database Structure

The Firestore database is organized into three main collections:

- **Content**: Movie metadata with genres, descriptions, and external IDs
- **Profiles**: User profiles with genre preferences and viewing history
- **Interactions**: User-content interactions for collaborative filtering

This structure enables both collaborative filtering (via interactions collection) and content-based filtering (via content metadata and profile preferences).

## 🔮 Future Enhancements

- User authentication system
- More advanced ML-based recommendation algorithms
- Watchlist functionality
- Rating system
- Content filtering options
- Enhanced mobile experience

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [MovieLens dataset](https://grouplens.org/datasets/movielens/) for movie metadata
- [OMDb API](https://www.omdbapi.com/) for movie information and posters
- [Netflix](https://www.netflix.com/in/browse/genre/83) for design inspiration
- [TailwindCSS](https://tailwindcss.com) for styling utilities
- All the open-source libraries used in this project

## 👨‍💻 About the Me

Created as a portfolio project to demonstrate frontend development skills, recommendation techniques, and UI implementation. Connect with me:

- GitHub: https://github.com/AbdulGani11
- LinkedIn: www.linkedin.com/in/abdulgani-dev
- Portfolio: 

---

⭐️ If you found this project interesting, consider giving it a star! ⭐️
