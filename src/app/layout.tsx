// Importieren von globalen CSS-Stilen und RootStyleRegistry-Komponente
import './globals.css'
import RootStyleRegistry from './emotion';
import React, { ReactNode } from 'react';

// Definieren der RootLayout-Komponente
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        // HTML-Grundstruktur definieren
        <html lang="en-US">
            <head />
            <body>
                <RootStyleRegistry>{children}</RootStyleRegistry>
            </body>
        </html>
    );
}
