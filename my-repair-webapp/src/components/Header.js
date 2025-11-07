import React from 'react';
import './Header.css';
import { Home, Sun, Moon, Wrench } from 'lucide-react'; // Wrench is your logo

export default function Header({ onNavigate, theme, setTheme }) {
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="header-container">
      <div 
        className="logo-container" 
        onClick={() => onNavigate('home')}
        title="Go to Home"
      >
        {/* THIS IS YOUR LOGO */}
        <Wrench size={32} color="var(--color-primary)" /> 
        <h1>Repair AI</h1>
      </div>
      
      <nav className="nav-buttons">
        <button 
          className="nav-button" 
          onClick={() => onNavigate('home')}
          title="Home"
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button 
          className="nav-button" 
          onClick={toggleTheme}
          title="Toggle light/dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </nav>
    </header>
  );
}