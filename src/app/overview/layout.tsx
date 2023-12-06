'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { AppShell, Center, Loader } from '@mantine/core';
import GameMasterMenuBar from '../../components/menuBars/GameMasterMenuBar';
import { firebase } from '@/utils/firebaseApp';

export default function GameMasterLayout({ children }: { children: any }) {
  const auth = getAuth(firebase);
  const [user, loading] = useAuthState(auth);

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
    return (
        <Center>
            <Loader />
        </Center>
    );
  }

  redirect('/');
}
