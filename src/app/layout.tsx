'use client';

import '@mantine/core/styles.css';
import '../global.css';
import React from 'react';
import { AppShell, Burger, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../utils/theme';

/*
export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};
*/


/*
export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en-US">
      <head>
        <title>metadata.title</title>
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
*/

export default function RootLayout({ children }: { children: any }) {
    return (
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: false } }}
          padding="md"
        >
            <AppShell.Header>
                <Burger /* opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" */ />
                <div>Logo</div>
            </AppShell.Header>
            <AppShell.Main>
                <MantineProvider theme={theme}>
                    <Notifications />
                    {children}
                </MantineProvider>
            </AppShell.Main>
        </AppShell>
    );
}
