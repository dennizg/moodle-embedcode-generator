import React, { useState, useRef, useEffect } from 'react';
import ContentTypeCard from './ContentTypeCard';
import {
    parseYoutube,
    parseSpotify,
    parseH5P,
    parseSharePointVideo,
    parseSharePointPDF,
    parseSharePointPowerPoint,
    parseSharePointExcel,
    parseSharePointWord,
    parseMiro,
    parsePadlet,
    parseMicrosoftForms,
    parseGenericEmbed
} from '../utils/parsers';
import { generateEmbedHTML } from '../utils/embedGenerator';

// Content type configuration
const CONTENT_TYPES = [
    { key: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube', parser: parseYoutube, placeholder: 'Plak YouTube URL, video-ID of embed code...' },
    { key: 'spotify', label: 'Spotify', icon: 'fa-brands fa-spotify', parser: parseSpotify, placeholder: 'Plak Spotify URL of embed code...' },
    { key: 'miro', label: 'Miro', icon: 'fa-solid fa-chalkboard', parser: parseMiro, placeholder: 'Plak Miro board URL of embed code...' },
    { key: 'padlet', label: 'Padlet', icon: 'fa-solid fa-note-sticky', parser: parsePadlet, placeholder: 'Plak Padlet URL of embed code...' },
    { key: 'h5p', label: 'H5P', icon: 'fa-solid fa-puzzle-piece', parser: parseH5P, placeholder: 'Plak H5P URL of embed code...' },
    { key: 'sharepoint-pdf', label: 'SharePoint PDF', icon: 'fa-solid fa-file-pdf', parser: parseSharePointPDF, placeholder: 'Plak SharePoint PDF URL of embed code...' },
    { key: 'sharepoint-ppt', label: 'PowerPoint', icon: 'fa-solid fa-file-powerpoint', parser: parseSharePointPowerPoint, placeholder: 'Plak SharePoint PowerPoint URL of embed code...' },
    { key: 'sharepoint-excel', label: 'Excel', icon: 'fa-solid fa-file-excel', parser: parseSharePointExcel, placeholder: 'Plak SharePoint Excel URL of embed code...' },
    { key: 'sharepoint-word', label: 'Word', icon: 'fa-solid fa-file-word', parser: parseSharePointWord, placeholder: 'Plak SharePoint Word URL of embed code...' },
    { key: 'sharepoint-video', label: 'SP Video', icon: 'fa-solid fa-video', parser: parseSharePointVideo, placeholder: 'Plak SharePoint/Stream video URL of embed code...' },
    { key: 'microsoft-forms', label: 'MS Forms', icon: 'fa-brands fa-microsoft', parser: parseMicrosoftForms, placeholder: 'Plak Microsoft Forms URL of embed code...' },
    { key: 'generic', label: 'Overig', icon: 'fa-solid fa-code', parser: parseGenericEmbed, placeholder: 'Plak hier een iframe embed code of directe URL...' },
];

const EmbedGenerator = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null); // { html, previewUrl }
    const [showCopied, setShowCopied] = useState(false);
    const inputRef = useRef(null);
    const resultRef = useRef(null);
    const copiedTimeoutRef = useRef(null);

    // Focus input when type is selected
    useEffect(() => {
        if (selectedType && !result) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [selectedType, result]);

    // Scroll to result when it appears
    useEffect(() => {
        if (result) {
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
        }
    }, [result]);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setInputValue('');
        setResult(null);
        setShowCopied(false);
    };

    const handleGenerate = () => {
        if (!inputValue.trim() || !selectedType) return;

        const config = CONTENT_TYPES.find(t => t.key === selectedType);
        if (!config) return;

        const parsed = config.parser(inputValue);
        if (!parsed) {
            alert('Ongeldige invoer. Controleer de URL of embed code en probeer opnieuw.');
            return;
        }

        // Get the URL for preview
        const previewUrl = typeof parsed === 'object' ? parsed.url : parsed;

        // Generate the Moodle HTML
        const html = generateEmbedHTML(selectedType, parsed);

        setResult({ html, previewUrl });

        // Auto-copy to clipboard
        navigator.clipboard.writeText(html).then(() => {
            setShowCopied(true);
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = setTimeout(() => setShowCopied(false), 4000);
        }).catch(() => {
            // Clipboard API might fail in some contexts
        });
    };

    const handleCopyAgain = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.html).then(() => {
            setShowCopied(true);
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = setTimeout(() => setShowCopied(false), 3000);
        });
    };

    const handleReset = () => {
        setSelectedType(null);
        setInputValue('');
        setResult(null);
        setShowCopied(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGenerate();
        }
    };

    const activeConfig = CONTENT_TYPES.find(t => t.key === selectedType);

    return (
        <div className="app-container">
            {/* Step 1: Choose content type */}
            <div className="section-label">
                {!result ? '① Kies het type content' : '✓ Embed gegenereerd'}
            </div>

            {!result && (
                <>
                    <div className="type-grid">
                        {CONTENT_TYPES.map(type => (
                            <ContentTypeCard
                                key={type.key}
                                icon={type.icon}
                                label={type.label}
                                isActive={selectedType === type.key}
                                onClick={() => handleTypeSelect(type.key)}
                            />
                        ))}
                    </div>

                    {/* Step 2: Paste URL */}
                    {selectedType && activeConfig && (
                        <div className="input-section">
                            <div className="section-label">② Plak de URL of embed code</div>
                            <div className="input-wrapper">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="input-field"
                                    placeholder={activeConfig.placeholder}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    className="input-submit-btn"
                                    onClick={handleGenerate}
                                    disabled={!inputValue.trim()}
                                    title="Genereer embed code"
                                >
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Step 3: Result */}
            {result && (
                <div className="result-section" ref={resultRef}>
                    <div className="result-card">
                        {/* Header */}
                        <div className="result-header">
                            <div className="result-header-left">
                                <span className="result-badge">
                                    <i className={activeConfig?.icon}></i>
                                    {activeConfig?.label}
                                </span>
                            </div>
                            {showCopied && (
                                <span className="copied-toast">
                                    <i className="fa-solid fa-check-circle"></i>
                                    Gekopieerd naar klembord!
                                </span>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="preview-area">
                            <div dangerouslySetInnerHTML={{ __html: result.html }} />
                        </div>

                        {/* Code */}
                        <div className="code-area">
                            <pre className="code-block">{result.html}</pre>
                            <button className="copy-btn" onClick={handleCopyAgain}>
                                <i className="fa-solid fa-copy"></i> Kopieer
                            </button>
                        </div>

                        {/* Next action */}
                        <div className="result-actions">
                            <button className="next-btn" onClick={handleReset}>
                                <i className="fa-solid fa-plus"></i>
                                Volgende embed maken
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmbedGenerator;
