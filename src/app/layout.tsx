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


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        /** Test */
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
