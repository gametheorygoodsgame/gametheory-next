'use client';

import { useRouter } from 'next/navigation';
import React, { KeyboardEventHandler, MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Center, Container, Paper, Stack, Text, TextInput, Title, Loader } from '@mantine/core';
import { GamePlayerApi, Player } from '@gametheorygoodsgame/gametheory-openapi/api';
import { IconChevronRight } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import * as loginNotifications from '@/components/notifications/login/loginNotifications';
import * as notifications from '@/components/notifications/notifications';
import { logger } from '@/utils/logger';
import ButtonModal from '@/components/modals/buttonModal';

interface StudentLoginProps {
  gameIdIn: string;
}

/**
 * Component for student login to join a game.
 *
 * Allows students to enter their name and a game ID to join an ongoing game.
 * Handles form submission and integrates with the API to add players to a game.
 * Displays modals and notifications for errors or successful actions.
 *
 * @param {StudentLoginProps} props - The component props.
 * @param {string} props.gameIdIn - The initial game ID passed into the component, typically from the URL.
 * @returns {JSX.Element} The rendered student login component.
 */
export default function StudentLogin(props: StudentLoginProps) {
  const { gameIdIn } = props;
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [errorDescription, setErrorDescription] = useState('');
  const [loading] = useState(false);
  const router = useRouter();
  const gamePlayerApi = new GamePlayerApi();

  /**
  * Handles form submission for logging in.
  * Validates input, adds the player to the game via API, and redirects on success.
  *
  * @param {MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>} e - The event triggered on button click or Enter key press.
  */
  // @ts-ignore
  // eslint-disable-next-line max-len
  const handleLoginSubmit = async (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>) => {
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

      if (!gameId) {
        setErrorDescription('No game ID found.');
        openErrorModal();
        throw new Error('No game ID found.');
      }

      const response = await gamePlayerApi.addPlayerToGameById(gameId, player);

      logger.debug(`Successfully created player ${response.data}`);

      if (response.status === 200) {
        loginNotifications.loginSuccess();
        logger.debug('Created login success notification.');

        document.cookie = `playerID=${response.data.id}; path=/; SameSite=None; Secure`;
        document.cookie = `gameID=${gameId}; path=/; SameSite=None; Secure`;

        logger.debug(`Created cookie {playerID=${response.data.id};gameID=${gameId}}`);

        router.push('../../game/cardSelection');
      } else if (response.status === 404) {
        loginNotifications.loginFailed();
        logger.debug('Created login failed notification.');
      } else {
        notifications.error({ message: JSON.stringify(response.data) });
        logger.debug('Created login error notification.');
      }
    } catch (error) {
      logger.error(error);
      notifications.error({ message: 'An error occurred while making the API call.' });
    }

    setPlayerName('');
  };

  // Allows form submission by pressing enter key
  // @ts-ignore
  // eslint-disable-next-line max-len
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoginSubmit(e);
    }
  };

  useEffect(() => {
    setGameId(gameIdIn);
  }, [gameIdIn]);

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
                  label="Benutzername"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleKeyPress}
                />
                <TextInput
                  label="Spiel-ID"
                  value={gameId ?? ''}
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  onChange={(e) => setGameId((_prevGameId) => e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleKeyPress}
                />
                <Button onClick={handleLoginSubmit} fullWidth my="xl">
                  Login
                </Button>
              </Stack>
              <Link href="../../login/gameMaster" style={{ textDecoration: 'none' }}>
                <Container fz={14} c="darkgray" ta="right" mr={0} p={0} pt={20}>
                  Dozenten-Login  <IconChevronRight size={16} style={{ verticalAlign: 'text-bottom' }} />
                </Container>
              </Link>
            </Paper>
          </Container>
        </Center>
      </>
  );
}
