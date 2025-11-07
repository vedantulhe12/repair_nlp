import React from 'react';
import './Footer.css';

// This is your new Footer, which appears on all pages.
export default function Footer() {
  return (
    <footer className="footer-container">
      <p>
        Need help? Contact the technical team at{' '}
        <a href="mailto:support@repairai.com">support@repairai.com</a>
      </p>
      <p>&copy; 2025 Repair AI. All rights reserved.</p>
    </footer>
  );
}