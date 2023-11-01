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
import { Game, GameApi } from '@eikermannlfh/gametheoryapi';
import { logger } from '@/utils/logger';
import { OverviewTable } from '@/components/overviewTable/overviewTable';

export default function GamesOverview() {
  const { height, width } = useViewportSize();
  const { push } = useRouter();
  const gameApi = new GameApi();

  const [openedCreateModal, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);
  const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [openedQRModal, { open: openQRModal, close: closeQRModal }] = useDisclosure(false);

  const [games, setGames] = useState<Game[]>([]);
  const [numberOfGames, setNumberOfGames] = useState(0);
  const [numRounds, setNumRounds] = useState<number | string>(10);
  const [clipboardClicked, setClipboardClicked] = useState(false);
  const [deleteGameID, setDeleteGameID] = useState<string | null>(null);
  const [clipboardGameID, setClipboardGameID] = useState<string | null>(null);
  const [qrGameID, setQRGameID] = useState<string | null>(null);

  async function fetchGameList() {
    try {
      const response = await gameApi.getAllGames();
      setGames(response.data);
      setNumberOfGames(response.data.length);
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  }

  const handleDeleteButtonClick = (gameID: string) => {
    openDeleteModal();
    setDeleteGameID(gameID);
  };

  const handleQRButtonClick = (gameID: string) => {
    openQRModal();
    setQRGameID(gameID);
  };

  function handleClipboardButtonClick(event: React.MouseEvent<HTMLElement>, gameID: string) {
    navigator.clipboard.writeText(`${window.location.host}/login/student/${gameID}`);
    setClipboardGameID(gameID);
    setTimeout(() => {
      setClipboardClicked(false);
      setClipboardGameID(null);
    }, 1000);
  }

  const handleSubmit = async () => {
    const game: Game = {
      id: '',
      numTurns: 5,
      currentTurn: 0,
      players: [],
      cardHandValue: [1],
      cardPotValue: [2],
      potCards: [0],
    };
    await gameApi.createGame(game);
    closeCreateModal();
  };

  const handleDelete = async () => {
    if (deleteGameID !== null) {
      try {
        await gameApi.deleteGameById(deleteGameID);
        await fetchGameList(); // Refresh the game list after deletion
        closeDeleteModal();
        setDeleteGameID(null);
      } catch (error) {
        logger.error("GameId to delete wasn't a number.");
      }
    }
  };

  function handleRowClick(gameID: string, event: React.MouseEvent) {
    const element = event.target as HTMLElement;
    if (element.classList.contains('mantine-icon')) {
      event.stopPropagation();
      return;
    }
    push(`/overview/${gameID}`);
  }

  useEffect(() => {
    fetchGameList();
  }, [openedCreateModal, openedDeleteModal]);

  return (
    <>
      <Modal opened={openedDeleteModal} onClose={closeDeleteModal} title="Löschen?">
        <Stack gap="xl">
          <Text>Sind Sie sich sicher, dass Sie das Spiel löschen wollen?</Text>
          <Group align="center">
            <Button onClick={closeDeleteModal}>Abbrechen</Button>
            <Button variant="outline" color="red" bg="white" onClick={handleDelete}>
              Löschen
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal opened={openedCreateModal} onClose={closeCreateModal} title="Neues Spiel">
        <Stack gap="xl">
          <NumberInput
            type="text"
            min={1}
            label="Anzahl der Runden"
            value={numRounds}
            onChange={setNumRounds}
          />
          <Group align="right">
            <Button onClick={handleSubmit}>Starten</Button>
          </Group>
        </Stack>
      </Modal>
      <Modal size={800} opened={openedQRModal} onClose={closeQRModal} title="QR Code">
        <Center>
          <Stack gap="xl">
            <Text>Scanne den Code zum Beitreten.</Text>
            <QRCodeSVG value={`${window.location.host}/login/student/${qrGameID}`} size={500} />
          </Stack>
        </Center>
        <Space h="lg" />
      </Modal>
      <Container p={60} fluid h={height - 63}>
        <Center px={120}>
          <Stack maw={1200} w={width - 120}>
            <Group align="right">
              <ActionIcon c="brand" size="lg" onClick={openCreateModal}>
                <IconSquarePlus />
              </ActionIcon>
            </Group>
            <OverviewTable
              games={games}
              onRowClick={handleRowClick}
              handleDeleteButtonClick={handleDeleteButtonClick}
              handleClipboardButtonClick={handleClipboardButtonClick}
              clipboardClicked={clipboardClicked}
              clipboardGameID={clipboardGameID}
              handleQRButtonClick={handleQRButtonClick}
            />
          </Stack>
        </Center>
      </Container>
    </>
  );
}
