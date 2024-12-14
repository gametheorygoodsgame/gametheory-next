import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../global.css';
import React from 'react';
import { AppShell, ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/utils/theme';

export const metadata = {
    title: 'Mantine Next.js template',
    description: 'I am using Mantine with Next.js!',
};

/**
 * The root layout component that wraps the entire application.
 * It sets up the HTML structure, including the `<head>` and `<body>` elements,
 * and provides a layout container using `AppShell` from Mantine.
 * The layout also integrates the `MantineProvider` for theming and `Notifications` for global notifications.

 * @param {Object} props - The props for the RootLayout component.
 * @param {React.ReactNode} props.children - The child components or content that will be rendered within the layout.
 * 
 * @returns {JSX.Element} The root layout of the application with applied theme, notifications, and children.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en-US">
            <head>
                <ColorSchemeScript />
                <title>Game Theory - Public Goods Game</title>
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <AppShell
                      transitionDuration={500}
                      transitionTimingFunction="ease"
                      header={{ height: 90 }}
                      padding="xs"
                      withBorder={false}
                    >
                        <Notifications position="bottom-right" />
                        {children}
                    </AppShell>
                </MantineProvider>
            </body>
        </html>
    );
}
