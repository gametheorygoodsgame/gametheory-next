'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import Link from 'next/link';
import { Button, Center, Container, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { GamePlayerApi, Player } from '@eikermannlfh/gametheoryapi/api';
import * as loginNotifications from '@/components/login/loginNotifications';
import * as notifications from '@/components/notifications';
import { logger } from '@/utils/logger';

interface StudentLoginProps {
  gameIdIn: string;
}

export default function StudentLogin(props: StudentLoginProps) {
  const { gameIdIn } = props;
  const [userName, setUserName] = useState('');
  const [gameId, setGameId] = useState(gameIdIn || '');
  const router = useRouter();
  const gamePlayerApi = new GamePlayerApi();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    loginNotifications.loginPending();
    logger.debug('Created wait notification');

    if (userName === '' || gameId === '') {
      loginNotifications.missingInput();
      logger.debug('Created missing login input notification');
      return;
    }

    try {
      const player: Player = {
        id: '',
        name: userName,
        moves: [],
        score: 0,
      };
      const response = await gamePlayerApi.addPlayerToGameById(gameId, player);

      logger.debug(`Successfully created player ${response.data}`);

      if (response.status === 200) {
        // Handle success
        loginNotifications.loginSuccess();
        logger.debug('Created login success notification.');

        document.cookie = `playerID=${response.data.id}`;
        document.cookie = `gameID=${gameId}`;

        logger.debug(`Created cookie {playerID=${response.data.id};gameID=${gameId}}`);

        router.push('../../game/kartenauswahl');
      } else if (response.status === 404) {
        // Handle not found
        loginNotifications.loginFailed();
        logger.debug('Created login failed notification.');
      } else {
        // Handle every other error from the server
        notifications.error({ message: (response.data as any as Error).message });
        logger.debug('Created login error notification.');
      }
    } catch (error) {
      // Handle any exceptions or network errors
      logger.error(error);
      notifications.error({ message: 'An error occurred while making the API call.' });
    }

    setUserName('');
    setGameId('');
  };

  return (
    <Center bg="brand.7" style={{ height: '100%' }}>
      <Container size={800} my={40}>
        <Title>Game Theory</Title>
        <Paper miw={300} withBorder shadow="md" p={20} mt={20} radius="md">
          <Stack gap="sm">
            <TextInput
              label="Benutzername"
              value={userName}
              onChange={(e) => setUserName(e.target.value.replace(/\s/g, ''))}
            />
            <TextInput
              label="Spiel-ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value.replace(/\s/g, ''))}
            />
            <Button onClick={handleSubmit} fullWidth my="xl">
              Login
            </Button>
          </Stack>
          <Link href="dozent" style={{ textDecoration: 'none' }}>
            <Container fz={14} c="darkgray" w={100} mr={0} p={0} ta="right">
              <Text>Dozenten-Login</Text>
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
