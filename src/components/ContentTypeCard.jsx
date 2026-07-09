import React from 'react';

const ContentTypeCard = ({ icon, label, isActive, onClick }) => {
    return (
        <div
            className={`type-card${isActive ? ' active' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <i className={`type-card-icon ${icon}`}></i>
            <span className="type-card-label">{label}</span>
        </div>
    );
};

export default ContentTypeCard;
