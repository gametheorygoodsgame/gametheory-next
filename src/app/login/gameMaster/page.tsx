'use client';

import React, {KeyboardEventHandler, MouseEvent, useRef, useState} from 'react';
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
} from '@mantine/core';
import { firebase } from '@/utils/firebaseApp';
import * as notifications from '../../../components/login/loginNotifications';
import { logger } from '@/utils/logger';

export default function DozentLogin() {
  const emailInputRef = useRef(null);
  const auth = getAuth(firebase);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);

  const handleLogin = async (e: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    e.preventDefault();
    notifications.loginPending();
    logger.debug('Created wait notification');

    if (email === '' || password === '') {
      notifications.missingInput();
      logger.debug('Created missing login input notification');
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        notifications.loginSuccess();
        logger.debug('Created login success notification.');
        logger.info('Game master login successful.');
        router.push('/overview');
      } catch (err) {
        logger.error(err);
        notifications.loginFailed();
        logger.debug('Created login failed notification.');
      }
    }
  };

  // @ts-ignore
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e: KeyboardEvent<HTMLInputElement>) => {
    // Check if Enter key is pressed (key code 13)
    if (e.key === 'Enter') {
      // Call your form submission function here
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
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Container fz={14} c="darkgray" ta="right" w={110} mr={0} p={0}>
                Studenten Login
                <Center>
                  <i className="fa fa-chevron-right" />
                </Center>
              </Container>
            </Link>
          </Paper>
        </Container>
      </Center>
    );
  }
}
