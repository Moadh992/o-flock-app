import React, { useState } from 'react';
import App from './App';
import { ProductHuntLanding } from './components/ProductHuntLanding';

export const Root: React.FC = () => {
    // Check if user has already entered the app before
    const hasEntered = typeof window !== 'undefined' && (localStorage.getItem('oflock_state') || localStorage.getItem('oflock_entered'));
    const [showApp, setShowApp] = useState(!!hasEntered);

    const handleEnterApp = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('oflock_entered', 'true');
        }
        setShowApp(true);
    };

    if (showApp) {
        return <App />;
    }

    return (
        <ProductHuntLanding
            onStart={handleEnterApp}
            onLogin={handleEnterApp}
        />
    );
};
