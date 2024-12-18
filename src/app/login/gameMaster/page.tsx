'use client';

import React, { KeyboardEventHandler, MouseEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Button,
  Center,
  Container,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { firebase } from '@/utils/firebaseApp';
import * as notifications from '@/components/notifications/login/loginNotifications';
import { logger } from '@/utils/logger';
import ButtonModal from '@/components/modals/buttonModal';

/**
 * Component for the login page of gameMaster/Dozent
 *
 * Handles email and password authentication for the gameMaster using Firebase.
 * Displays a loading spinner during authentication or redirects to the overview page if already logged in.
 * Includes error handling with notifications and modals for login issues.
 * 
 * @returns {JSX.Element} The rendered instructor login page.
 */
export default function DozentLogin() {
  const emailInputRef = useRef(null);
  const auth = getAuth(firebase);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [errorDescription, setErrorDescription] = useState('');

  const handleLogin = async (e: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    e.preventDefault();
    notifications.loginPending();
    logger.debug('Created wait notification.');

    if (email === '' || password === '') {
      notifications.missingInput();
      logger.debug('Created missing login input notification.');
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        notifications.loginSuccess();
        logger.debug('Created login success notification.');
        logger.info('Game master login successful.');

        router.push('/overview');
      } catch (error) {
        logger.error(error);
        notifications.loginFailed();
        setErrorDescription(`${(error as Error).name}: ${(error as Error).cause}; ${(error as Error).stack}`);
        openErrorModal();
        logger.debug('Opened login failed modal.');
      }
    }
  };

  // Using Enter Key to submit form.
  // @ts-ignore
  // eslint-disable-next-line max-len
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  if (user) {
    router.push('/overview');
    logger.debug('Redirected to /overview');
  } else {
    if (loading) {
      return (
        <Center>
          <Loader />
        </Center>
      );
    }
    return (
      <>
        <ButtonModal
          opened={hasError}
          onClose={closeErrorModal}
          title="Fehler"
          rightButton={{ callback: closeErrorModal, text: 'Schließen' }}
        >
          <Text>{errorDescription}</Text>
        </ButtonModal>
        <Center bg="brand.7" style={{ height: '100%' }}>
          <Container size={800} my={40}>
            <Title>Game Theory</Title>
            <Paper miw={300} withBorder shadow="md" p={20} mt={20} radius="md">
              <Stack gap="sm">
                <TextInput
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleKeyPress}
                  ref={emailInputRef}
                />
                <PasswordInput
                  placeholder="Password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleKeyPress}
                />
                <Button onClick={handleLogin} fullWidth my="xl">
                  Login
                </Button>
              </Stack>
              <Stack align="center" gap="xs">
                <Link href="/" style={{ textDecoration: 'none' }}>
                  Passwort vergessen?
                </Link>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  Registrieren
                </Link>
              </Stack>
              <Link href="../../login/player" style={{ textDecoration: 'none' }}>
                  <Container fz={14} c="darkgray" ta="right" mr={0} p={0} pt={20}>
                    Studenten-Login  <IconChevronRight size={16} style={{ verticalAlign: 'text-bottom' }} />
                  </Container>
              </Link>
            </Paper>
          </Container>
        </Center>
      </>
    );
  }
}
