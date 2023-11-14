'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Center, Container, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { GamePlayerApi, Player } from '@gametheorygoodsgame/gametheory-openapi/api';
import * as loginNotifications from '@/components/login/loginNotifications';
import * as notifications from '@/components/notifications';
import { logger } from '@/utils/logger';

interface StudentLoginProps {
  gameIdIn: string;
}

export default function StudentLogin(props: StudentLoginProps) {
  const { gameIdIn } = props;
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState(gameIdIn || '');
  const router = useRouter();
  const gamePlayerApi = new GamePlayerApi();

  const handleLoginSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    loginNotifications.loginPending();
    logger.debug('Created wait notification');

    // if one is not entered show a notification
    if (playerName === '' || gameId === '') {
      loginNotifications.missingInput();
      logger.debug('Created missing login input notification');
      return;
    }

    try {
      const player: Player = {
        id: '',
        name: playerName,
        moves: [],
        score: 0,
      };

      // sending request to server
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

    setPlayerName('');
    setGameId('');
  };

  useEffect(() => {
    setGameId(gameIdIn);
  }, [gameIdIn]);

  return (
    <Center bg="brand.7" style={{ height: '100%' }}>
      <Container size={800} my={40}>
        <Title>Game Theory</Title>
        <Paper miw={300} withBorder shadow="md" p={20} mt={20} radius="md">
          <Stack gap="sm">
            <TextInput
              label="Benutzername"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.replace(/\s/g, ''))}
            />
            <TextInput
              label="Spiel-ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value.replace(/\s/g, ''))}
            />
            <Button onClick={handleLoginSubmit} fullWidth my="xl">
              Login
            </Button>
          </Stack>
          <Link href="gameMaster" style={{ textDecoration: 'none' }}>
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
