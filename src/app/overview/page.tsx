'use client';

import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  Modal,
  NumberInput,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconSquarePlus } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import '../../components/overviewTable/overviewTable.css';
import { Game, GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import { logger } from '@/utils/logger';
import { OverviewTable } from '@/components/overviewTable/overviewTable';
import {useModal} from "@/utils/hooks";

export default function GamesOverview() {
  const { height: screenHeight, width: screenWidth } = useViewportSize();
  const { push } = useRouter();
  const gameApi = new GameApi();

  const {
    isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const {
    isOpen: isQrModalOpen,
    openModal: openQrModal,
    closeModal: closeQrModal,
  } = useModal();

  const [games, setGames] = useState<Game[]>([]);
  const [numTurns, setNumTurns] = useState<number>(10);
  const [clipboardClicked, setClipboardClicked] = useState(false);
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);
  const [clipboardGameId, setClipboardGameId] = useState<string | null>(null);
  const [qrGameID, setQRGameId] = useState<string | null>(null);

  async function fetchGameList() {
    try {
      const response = await gameApi.getAllGames();
      setGames(response.data);
      logger.info('Fetched game data successfully.');
      logger.debug(response.data);
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  }

  const handleRowClick = (gameId: string, event: React.MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('mantine-icon')) {
      event.stopPropagation();
      return;
    }
    push(`/overview/${gameId}`); // Weiterleitung zur Detailansicht des ausgewählten Spiels
  };

  const handleNumTurnsChange = (value: string | number) => {
    const parsedValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setNumTurns(parsedValue);
  };

  const handleDeleteButtonClick = (gameId: string) => {
    openDeleteModal();
    logger.debug('Delete modal opened.');
    setDeleteGameId(gameId);
    logger.debug(`DeleteGameId set to ${gameId}.`);
  };

  const handleQrButtonClick = (gameId: string) => {
    openQrModal();
    logger.debug('QR modal opened.');
    setQRGameId(gameId);
    logger.debug(`QRGameId set to ${gameId}.`);
  };

  function handleClipboardButtonClick(event: React.MouseEvent<HTMLElement>, gameId: string) {
    const clipboardURL = `${window.location.protocol}//${window.location.host}/login/player/${gameId}`;
    navigator.clipboard.writeText(clipboardURL);
    logger.debug(`ClipboardURL: ${clipboardURL}`);
    setClipboardGameId(gameId);
    setClipboardClicked(true);
    logger.debug(`ClipboardGameId set to ${gameId}.`);
    setTimeout(() => {
      setClipboardClicked(false);
      setClipboardGameId(null);
    }, 1000);
    logger.info('Copied game URL to clipboard.');
  }

  const handleOpenButtonClick = (gameId: string) => {
    push(`/overview/${gameId}`);
  };

  const handleCreateGame = async () => {
    try {
      const game: Game = {
        id: '',
        numTurns,
        currentTurn: 0,
        players: [],
        cardHandValue: [0],
        cardPotValue: [0],
        potCards: [0],
      };
      await gameApi.createGame(game);
      closeCreateModal();
      logger.debug(game);
      logger.info('Created a new game.');
    } catch (error) {
      // Handle the error here
      logger.error('An error occurred while creating the game:', error);
      // Optionally, you can show an error message to the user or perform other error-handling actions.
    }
  };

  const handleDeleteGame = async () => {
    if (deleteGameId !== null) {
      try {
        await gameApi.deleteGameById(deleteGameId);
        await fetchGameList(); // Refresh the game list after deletion
        closeDeleteModal();
        logger.debug('Delete modal closed.');
        setDeleteGameId(null);
        logger.info(`Deleted game ${deleteGameId} successfully.`);
      } catch (error) {
        logger.error("GameId to delete wasn't a number.");
      }
    }
  };

  useEffect(() => {
    fetchGameList();
  }, [isCreateModalOpen, isDeleteModalOpen]);

  return (
      <>
        <Modal opened={isDeleteModalOpen} onClose={closeDeleteModal} title="Löschen?">
          <Stack gap="xl">
            <Text>Sind Sie sich sicher, dass Sie das Spiel löschen wollen?</Text>
            <Group align="center">
              <Button onClick={closeDeleteModal}>Abbrechen</Button>
              <Button variant="outline" color="red" bg="white" onClick={handleDeleteGame}>
                Löschen
              </Button>
            </Group>
          </Stack>
        </Modal>
        <Modal opened={isCreateModalOpen} onClose={closeCreateModal} title="Neues Spiel">
          <Stack gap="xl">
            <NumberInput
                type="text"
                min={1}
                label="Anzahl der Runden"
                value={numTurns}
                onChange={handleNumTurnsChange}
            />
            <Group align="right">
              <Button onClick={handleCreateGame}>Starten</Button>
            </Group>
          </Stack>
        </Modal>
        <Modal size={800} opened={isQrModalOpen} onClose={closeQrModal} title="QR Code">
          <Center>
            <Stack gap="xl">
              <Text>Scanne den Code zum Beitreten.</Text>
              <QRCodeSVG value={`${window.location.host}/login/player/${qrGameID}`}  size={screenHeight>900 ? 700: screenHeight - 200} />
            </Stack>
          </Center>
          <Space h="lg" />
        </Modal>
        <Container p={60} fluid h={screenHeight - 63}>
          <Center px={120}>
            <Stack maw={1200} w={screenWidth - 120}>
              <Group align="right" dir="right">
                <ActionIcon c="brand" size="lg" bg="transparent" onClick={openCreateModal}>
                  <IconSquarePlus />
                </ActionIcon>
              </Group>
              <OverviewTable
                  games={games}
                  handleOpenButtonClick={handleOpenButtonClick}
                  handleDeleteButtonClick={handleDeleteButtonClick}
                  handleClipboardButtonClick={handleClipboardButtonClick}
                  clipboardClicked={clipboardClicked}
                  clipboardGameID={clipboardGameId}
                  handleQRButtonClick={handleQrButtonClick}
                  handleRowClick={handleRowClick}
              />
            </Stack>
          </Center>
        </Container>
      </>
  );
}
