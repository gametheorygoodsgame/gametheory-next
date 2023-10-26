'use client';

import React, { MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
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
import { notifications } from '@mantine/notifications';
import firebase from '../../firebaseApp';

export default function DozentLogin() {
  const auth = getAuth(firebase);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);

  const showNotification = (title: string, message: string, color: string) => {
    notifications.update({
      id: 'load-data',
      loading: false,
      color,
      title,
      message,
      icon: color === 'red' ? <IconExclamationCircle size="1rem" /> : <IconCheck size="1rem" />,
    });
  };

  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    notifications.show({
      id: 'load-data',
      color: 'brand.0',
      loading: true,
      title: 'Versuche Login',
      message: 'Du kannst das noch nicht schließen.',
      autoClose: false,
      withCloseButton: false,
    });

    if (email === '' || password === '') {
      showNotification('Upps😵‍💫', 'Bitte geben Sie Ihre Nutzerinformationen ein!', 'red');
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification('Success', 'Login erfolgreich', 'teal');
        router.push('/overview');
      } catch (err) {
        console.error(err);
        showNotification(
          'Upps, Anmeldung fehlgeschlagen. 😕',
          'Bitte überprüfe deine Anmeldeinformationen!',
          'red'
        );
      }
    }
  };

  if (user) {
    router.push('/overview');
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
          <Title
            c="white"
            ta="center"
            style={{ fontFamily: 'Castellar, sans-serif', fontWeight: 800 }}
          >
            Game Theory
          </Title>
          <Paper miw={300} withBorder shadow="md" p={20} mt={20} radius="md">
            <Stack gap="sm">
              <TextInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              />
              <PasswordInput
                placeholder="Password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
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
