'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { AppShell, Center, Loader } from '@mantine/core';
import GameMasterMenuBar from '../../components/menuBars/GameMasterMenuBar';
import { firebase } from '@/utils/firebaseApp';

/**
 * Layout component for the Game Master section.
 *
 * Provides a layout structure that includes a header with a menu bar and a main content area.
 * Ensures that the user is authenticated before displaying the content. If the user is not
 * authenticated, redirects to the home page.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render within the layout.
 * @returns {JSX.Element} The rendered Game Master layout or a loading indicator during authentication.
 */
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
