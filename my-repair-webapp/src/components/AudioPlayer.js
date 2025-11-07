import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import './AudioPlayer.css';

// This is the re-usable Audio Player component
export default function AudioPlayer({ textMap }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [voices, setVoices] = useState([]);

  // Load the available voices from the browser
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const getVoice = (lang) => {
    // Find the best matching voice for the language
    return voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  };

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToSpeak = textMap[selectedLang.split('-')[0]];
      if (!textToSpeak) {
        console.error("No text for language:", selectedLang);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedLang;
      utterance.voice = getVoice(selectedLang);
      
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const languages = {
    'English': 'en-US',
    'Hindi (हिन्दी)': 'hi-IN',
    'French (Français)': 'fr-FR',
    'German (Deutsch)': 'de-DE',
    'Spanish (Español)': 'es-ES',
    'Urdu (اردو)': 'ur-PK',
    'Korean (한국어)': 'ko-KR',
    'Chinese (中文)': 'zh-CN',
    'Japanese (日本語)':'ja-JP',
  };

  return (
    <div className="audio-player-container">
      <select 
        value={selectedLang} 
        onChange={(e) => setSelectedLang(e.target.value)}
        className="lang-select"
      >
        {Object.entries(languages).map(([name, code]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
      <button onClick={handlePlay} className="play-button" title="Play/Pause">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
}