'use client';

import React from 'react';
import { AppShell } from '@mantine/core';

/**
 * Layout component for the login page of the player.
 *
 * Provides a consistent layout structure with a header and main content area.
 * Both the header and main sections use a background color defined by the `brand.7` theme.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the layout.
 * @returns {JSX.Element} The rendered login layout component.
 */
export default function LoginLayout({ children }: { children: any }) {
    return (
        <>
            <AppShell.Header bg="brand.7" />
            <AppShell.Main bg="brand.7">
                {children}
            </AppShell.Main>
        </>
    );
}
