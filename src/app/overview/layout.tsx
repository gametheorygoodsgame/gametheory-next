'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import GameMasterMenuBar from '../../components/menuBars/GameMasterMenuBar';
import { firebase } from '@/utils/firebaseApp';
import {AppShell} from "@mantine/core";

export default function GameMasterLayout({ children }: { children: any }) {
  const auth = getAuth(firebase);
  const [user, loading, error] = useAuthState(auth);

  if (user) {
    return (
      <>
        <AppShell.Header>
          <GameMasterMenuBar />
        </AppShell.Header>
        <AppShell.Main>
            {children}
        </AppShell.Main>
      </>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  redirect('/');
}
