import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../global.css';
import React from 'react';
import {AppShell, ColorSchemeScript, Combobox, MantineProvider} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../utils/theme';

export const metadata = {
    title: 'Mantine Next.js template',
    description: 'I am using Mantine with Next.js!',
};

/*export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en-US">
      <head>
        <ColorSchemeScript />
        <title>metadata.title</title>
      </head>
      <body>
        <MantineProvider theme={theme}>
            {children}
            <Notifications position={"bottom-right"}/>
        </MantineProvider>
      </body>
    </html>
  );
}

 */

export default function RootLayout({ children }: { children: React.ReactNode }){
    return (
        <html lang="en-US">
            <head>
                <ColorSchemeScript />
                <title>metadata.title</title>
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
                        <Notifications position={"bottom-right"}/>
                        {children}
                    </AppShell>
                </MantineProvider>
            </body>
        </html>
    );
}

/*
export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en-US">
      <head>
        <title>metadata.title</title>
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: false } }}
            padding="md"
          >
            <AppShell.Header>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <div>Logo</div>
            </AppShell.Header>
            <AppShell.Main>
              <Notifications />
              {children}
            </AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
*/