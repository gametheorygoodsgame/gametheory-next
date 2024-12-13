'use client';

import { AppShell } from '@mantine/core';
import React from 'react';
import PlayerMenuBar from '../../components/menuBars/PlayerMenuBar';

/**
 * Layout component for student/player pages.
 * 
 * This layout includes a header with the player menu bar
 * and a main content area for rendering child components.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The content to display within the layout.
 * @returns {JSX.Element} The complete layout component.
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
