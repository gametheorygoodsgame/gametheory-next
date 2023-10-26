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
  Table,
  Text,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import {
  IconClipboard,
  IconClipboardCheck,
  IconQrcode,
  IconSquarePlus,
  IconTrash,
} from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation'; // Import useRouter from the correct location
import './noselect.css';

export default function Overview() {
  const { height, width } = useViewportSize();
  const [openedCreateModal, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);
  const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [openedQRModal, { open: openQRModal, close: closeQRModal }] = useDisclosure(false);
  const [games, setGames] = useState<Game[]>([]); // Add type for games
  const [numberOfGames, setNumberOfGames] = useState(0);
  const [numRounds, setNumRounds] = useState<number | string>(10);
  const { push } = useRouter();
  const [clipboardClicked, setClipboardClicked] = useState(false);
  const [deleteGameID, setDeleteGameID] = useState<string | null>(null); // Add type for deleteGameID
  const [clipboardGameID, setClipboardGameID] = useState<string | null>(null); // Add type for clipboardGameID
  const [qrGameID, setQRGameID] = useState<string | null>(null); // Add type for qrGameID

  const handleSubmit = async () => {
    await fetch('/api/games', {
      method: 'POST',
      body: JSON.stringify(numRounds),
      headers: { 'Content-Type': 'application/json' },
    });
    closeCreateModal();
  };

  const handleDelete = async () => {
    await fetch('/api/games', {
      method: 'DELETE',
      body: JSON.stringify(deleteGameID),
      headers: { 'Content-Type': 'application/json' },
    });
    closeDeleteModal();
    setDeleteGameID(null);
  };

  const handleRowClick = (gameID: string, event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    if (element.classList.contains('mantine-icon')) {
      event.stopPropagation();
      return;
    }
    push(`/overview/${gameID}`);
  };

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

  function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomDataArray(length) {
    const dataArray = [];

    for (let i = 0; i < length; i++) {
      const gameID = Math.random().toString(36).substring(7);
      const playerNumber = getRandomValue(1, 10);
      const currentRound = getRandomValue(1, 20);
      const numRounds = getRandomValue(10, 30);

      dataArray.push({
        gameID,
        playerNumber,
        currentRound,
        numRounds,
      });
    }

    return dataArray;
  }

  async function fetchGameList() {
    try {
      //const response = await fetch('/api/games');
      //const data = await response.json();
      //const { gameListInfo } = data;
      //setGames(gameListInfo.gameList);
      setGames(generateRandomDataArray(10));
      setNumberOfGames(10);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => {
    fetchGameList();
  }, [openedCreateModal, openedDeleteModal]);

  type Game = {
    gameID: string;
    playerNumber: number;
    currentRound: number;
    numRounds: number;
    // Add other properties as needed
  };

  const rows = games.map((game: Game) => (
    <tr
      className="noselect"
      key={game.gameID}
      onDoubleClick={(event) => handleRowClick(game.gameID, event)}
    >
      <td>{game.gameID}</td>
      <td>{game.playerNumber}</td>
      <td>
        {game.currentRound}/{game.numRounds}
      </td>
      <td className="mantine-icon">
        <Group className="mantine-icon">
          <ActionIcon color="red" className="mantine-icon">
            <IconTrash
              className="mantine-icon"
              onClick={() => handleDeleteButtonClick(game.gameID)}
            />
          </ActionIcon>
          <ActionIcon
            className="mantine-icon"
            onClick={(event) => handleClipboardButtonClick(event, game.gameID)}
          >
            {clipboardClicked && game.gameID === clipboardGameID ? (
              <IconClipboardCheck color="green" className="mantine-icon" />
            ) : (
              <IconClipboard className="mantine-icon" />
            )}
          </ActionIcon>
          <ActionIcon className="mantine-icon">
            <IconQrcode className="mantine-icon" onClick={() => handleQRButtonClick(game.gameID)} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

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
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th>Spiel-ID</th>
                  <th>Anzahl der Spieler</th>
                  <th>Runden</th>
                  <th />
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Stack>
        </Center>
      </Container>
    </>
  );
}
