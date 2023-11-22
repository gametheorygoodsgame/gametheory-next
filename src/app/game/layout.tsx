'use client';

import PlayerMenuBar from '../../components/menuBars/PlayerMenuBar';
import {AppShell} from '@mantine/core';
import React from "react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
          <AppShell.Header>
              <PlayerMenuBar />
          </AppShell.Header>
          <AppShell.Main bg={"white"}>
              {children}
          </AppShell.Main>
      </>
  );
}
