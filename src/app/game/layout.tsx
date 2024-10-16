'use client';

import { AppShell } from '@mantine/core';
import React from 'react';
import PlayerMenuBar from '../../components/menuBars/PlayerMenuBar';

/**
 * This function defines a layout component for student pages in a TypeScript React application.
 * @param  - The `StudentLayout` function is a React component that serves as a layout for
 * student-related pages. It takes a `children` prop, which represents the content that will be
 * rendered within the layout. The layout consists of an `AppShell` component with a header containing
 * a `PlayerMenuBar` component
 * @returns The `StudentLayout` function is returning a JSX structure that includes an `AppShell`
 * component with a `Header` and a `Main` component. Inside the `Header`, a `PlayerMenuBar` component
 * is rendered. The `Main` component has a background color set to white and renders the `children`
 * passed to the `StudentLayout` component.
 */
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
          <AppShell.Header>
              <PlayerMenuBar />
          </AppShell.Header>
          <AppShell.Main bg="white">
              {children}
          </AppShell.Main>
      </>
  );
}
