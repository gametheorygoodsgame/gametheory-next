'use client';

import { AppShell } from '@mantine/core';
import React from 'react';
import PlayerMenuBar from '../../components/menuBars/PlayerMenuBar';

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
