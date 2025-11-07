import React, { useState } from 'react';
import './App.css'; // We'll create this file for styles

// Import our new components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AskPage from './pages/AskPage';
import DetectPage from './pages/DetectPage';

// This is the "API_URL" from before.
// Make sure your Python server is running!
const API_URL = 'http://localhost:8000';

function App() {
  // This state controls which page we see
  const [currentPage, setCurrentPage] = useState('home');
  // This state controls the theme
  const [theme, setTheme] = useState('dark');

  // A simple function to switch pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'ask':
        return <AskPage apiUrl={API_URL} />;
      case 'detect':
        return <DetectPage apiUrl={API_URL} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    // The 'data-theme' attribute is what controls our light/dark mode
    <div className="App" data-theme={theme}>
      {/* AI Background Image is applied via CSS */}
      <div className="App-background" />
      
      <div className="App-content">
        <Header 
          onNavigate={setCurrentPage} 
          theme={theme} 
          setTheme={setTheme} 
        />
        <main className="App-main">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;