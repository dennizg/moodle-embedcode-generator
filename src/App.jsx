import React, { useState, useEffect } from 'react';
import EmbedGenerator from './components/EmbedGenerator';
import '@fortawesome/fontawesome-free/css/all.min.css';
import packageJson from '../package.json';

function App() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage or system preference
        const saved = localStorage.getItem('moodle-embed-theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('moodle-embed-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="App">
            <div className="app-header" style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px 0' }}>
                <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Donker thema' : 'Licht thema'}>
                    <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'}></i>
                </button>
                <h1>Moodle Embed Generator</h1>
                <p>Pijlsnel embed code genereren voor Moodle</p>
            </div>

            <EmbedGenerator />

            <footer style={{
                textAlign: 'center',
                padding: '24px 24px 40px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                borderTop: '1px solid var(--border-color)',
                maxWidth: '880px',
                margin: '40px auto 0',
                opacity: 0.8
            }}>
                © 2026 Dennis Goedbloed & contributors • v{packageJson.version}
            </footer>
        </div>
    );
}

export default App;

