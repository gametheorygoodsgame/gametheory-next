'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Center,
  Container,
  Group,
  Modal,
  NumberInput,
  Space,
  Stack,
  Text,
  TextInput,
  Tooltip,
  Loader } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconSquarePlus } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { Game, GameApi } from '@gametheorygoodsgame/gametheory-openapi/api';
import { Player, Move } from '@gametheorygoodsgame/gametheory-openapi/api';
import { logger } from '@/utils/logger';
import { OverviewTable } from '@/components/overviewTable/overviewTable';
import { useInterval } from '@/utils/hooks';
import ButtonModal from '@/components/modals/buttonModal';
import * as XLSX from 'xlsx';


/**
 * Displays an overview of all games and provides actions to manage games.
 *
 * The `GamesOverview` component fetches and lists all games, allowing the gameMaster to:
 * - Create a new game
 * - View game details
 * - Export game data to Excel
 * - Copy game invite links to the clipboard
 * - View game-specific QR codes
 * - Delete games
 *
 * @returns {JSX.Element} The rendered Games Overview component.
 */
export default function GamesOverview() {
  const { height: screenHeight, width: screenWidth } = useViewportSize();

  const shortestDimension = shortestOf( screenHeight, screenWidth);


  
  const { push } = useRouter();
  const gameApi = new GameApi();

  const [isCreateModalOpen, { open: openCreateModal, close: closeCreateModal }] = useDisclosure();
  const [isDeleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [isQrModalOpen, { open: openQrModal, close: closeQrModal }] = useDisclosure();
  const [hasError, { open: openErrorModal, close: closeErrorModal }] = useDisclosure(false);
  const [errorDescription, setErrorDescription] = useState('');
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [games, setGames] = useState<Game[]>([]);
  const [gameName, setGameName] = useState('');
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
      setErrorDescription(`${(error as Error).name}: ${(error as Error).cause}; ${(error as Error).stack}`);
      logger.error('Error fetching data: ', error);
      openErrorModal();
    } finally {
      setLoading(false);
    }
  }

   /**
   * Handles row clicks in the game table and navigates to the game..
   *
   * @param {string} gameId - The ID of the clicked game.
   * @param {React.MouseEvent} event - The mouse event triggered by the click.
   */
  const handleRowClick = (gameId: string, event: React.MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('mantine-icon')) {
      event.stopPropagation();
      return;
    }
    push(`/overview/${gameId}`); // Navigating to selected game.
  };

  const handleNumTurnsChange = (value: string | number) => {
    const parsedValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setNumTurns(parsedValue);
  };

   /**
   * Opens the delete modal and sets the game ID for deletion.
   *
   * @param {string} gameId - The ID of the game to delete.
   */
  const handleDeleteButtonClick = (gameId: string) => {
    openDeleteModal();
    logger.debug('Delete modal opened.');
    setDeleteGameId(gameId);
    logger.debug(`DeleteGameId set to ${gameId}.`);
  };

   /**
   * Opens the QR code modal and sets the game ID for QR code generation.
   *
   * @param {string} gameId - The ID of the game to generate a QR code for.
   */
  const handleQrButtonClick = (gameId: string) => {
    openQrModal();
    logger.debug('QR modal opened.');
    setQRGameId(gameId);
    logger.debug(`QRGameId set to ${gameId}.`);
  };

  /**
   * Copies the game invite URL to the clipboard and shows a success message.
   *
   * @param {React.MouseEvent<HTMLElement>} event - The click event.
   * @param {string} gameId - The ID of the game.
   */
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

  /**
   * Creates a new game with the specified name and number of turns.
   *
   * @async
   * @function
   */
  const handleCreateGame = async () => {
    try {
      const game: Game = {
        id: '',
        name: gameName,
        numTurns,
        currentTurn: 0,
        players: [],
        cardHandValue: [0],
        cardPotValue: [0],
        potCards: [0],
      };
      await gameApi.createGame(game);
      closeCreateModal();
      fetchGameList();
      logger.debug(game);
      logger.info('Created a new game.');
    } catch (error) {
      logger.error('An error occurred while creating the game:', error);
      openErrorModal();
    }
  };

  const handleDeleteGame = async () => {
    if (deleteGameId !== null) {
      try {
        await gameApi.deleteGameById(deleteGameId);
        await fetchGameList();
        closeDeleteModal();
        logger.debug('Delete modal closed.');
        setDeleteGameId(null);
        logger.info(`Deleted game ${deleteGameId} successfully.`);
      } catch (error) {
        logger.error("GameId to delete wasn't a number.");
        openErrorModal();
      }
    }
  };

const exportToExcel = (game: Game) => {
  const calculateColumnWidths = (data: { [key: string]: any }[]) => {
    const colWidths: number[] = [];
    if (data.length > 0) {
      Object.keys(data[0]).forEach((col, i) => (colWidths[i] = col.length));
    }
    data.forEach(row => {
      Object.keys(row).forEach((col, i) => {
        const len = (row[col] ?? "").toString().length;
        if (len > colWidths[i]) colWidths[i] = len;
      });
    });
    return colWidths.map(w => ({ wch: Math.max(w, 14) }));
  };

  const asNumber = (v: unknown) => (typeof v === "number" ? v : Number(v));
  // Nur wer exakt -1 hat, gilt als aktiv. Alles andere → ausschließen.
  const isEligible = (p: Player) => asNumber(p.inactiveSinceTurn) === -1;

  const wb = XLSX.utils.book_new();
  const generalData: { [key: string]: any }[] = [];
  const playerBalances: { name: string; balance: number; data: { [key: string]: any }[] }[] = [];

  // Nur aktive Spieler (strict)
  const eligiblePlayers = game.players.filter(isEligible);

  // 🔹 Pot: nur aktive Spieler zählen
  const potRedCardsByTurn: Record<number, number> = {};
  for (let turn = 1; turn <= game.numTurns; turn++) {
    let pot = 0;
    for (const p of eligiblePlayers) {
      const mv = p.moves.find((m: Move) => m.numTurn === turn);
      pot += mv ? Math.max(0, Math.min(2, mv.numRedCards)) : 0;
    }
    potRedCardsByTurn[turn] = pot;
  }

  // 🔹 Spielerberechnung: nur aktive, über alle Runden (da immer aktiv)
  for (const player of eligiblePlayers) {
    let balance = 0;
    const playerData: { [key: string]: any }[] = [];

    for (let turn = 1; turn <= game.numTurns; turn++) {
      const cardValue = Number(game.cardHandValue[turn] ?? 0);
      const mv = player.moves.find((m: Move) => m.numTurn === turn);
      const numRedCards = mv ? Math.max(0, Math.min(2, mv.numRedCards)) : 0;

      const keptRedCards = Math.max(0, 2 - numRedCards);
      const potValue = potRedCardsByTurn[turn] ?? 0;

      balance += keptRedCards * cardValue + potValue;

      playerData.push({
        "Runde": turn,
        "Kartenwert": cardValue,
        "Rote Karten im Pot": potValue,
        "abgegebene Rote Karten": numRedCards,
        "behaltene Rote Karten": keptRedCards,
        "Kontostand": balance,
      });
    }

    playerBalances.push({ name: player.name, balance, data: playerData });
  }

  // 🔹 Ranking
  playerBalances.sort((a, b) => b.balance - a.balance);

  // 🔹 Allgemeines Blatt (nur aktive zählen)
  generalData.push({
    "Spiel-Titel": game.name,
    "Anzahl der Runden": game.numTurns,
    "Anzahl der Spieler": playerBalances.length,
    "": "",
    "Spielername": "",
    "Kontostand": "",
  });
  for (const pb of playerBalances) {
    generalData.push({ "Spielername": pb.name, "Kontostand": pb.balance });
  }

  const generalSheet = XLSX.utils.json_to_sheet(generalData);
  generalSheet["!cols"] = calculateColumnWidths(generalData);
  XLSX.utils.book_append_sheet(wb, generalSheet, "Spiel-Info");

  // 🔹 Ein Blatt je aktivem Spieler
  for (const pb of playerBalances) {
    const playerSheet = XLSX.utils.json_to_sheet(pb.data);
    playerSheet["!cols"] = calculateColumnWidths(pb.data);
    XLSX.utils.book_append_sheet(wb, playerSheet, pb.name);
  }

  XLSX.writeFile(wb, game.name + ".xlsx");
};



  /*
  useEffect(() => {
    fetchGameList();
  }, [isCreateModalOpen, isDeleteModalOpen]);

   */

  useInterval(fetchGameList, 10000);

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
          leftButton={{ callback: closeErrorModal, text: 'Schließen' }}
          rightButton={{ callback: () => router.push('/overview'), text: 'Zurück zur Übersicht' }}
        >
          <Text>{errorDescription}</Text>
        </ButtonModal>
        <ButtonModal
          opened={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Löschen?"
          leftButton={{ callback: closeDeleteModal, text: 'Abbrechen' }}
          rightButton={{ callback: handleDeleteGame, text: 'Löschen' }}
        >
          <Text>{errorDescription}</Text>
        </ButtonModal>
        <ButtonModal
          opened={isCreateModalOpen}
          onClose={closeCreateModal}
          title="Neues Spiel"
          leftButton={{ callback: closeCreateModal, text: 'Abbrechen' }}
          rightButton={{ callback: handleCreateGame, text: 'Starten' }}
        >
          <NumberInput
            min={1}
            max={100}
            label="Anzahl der Runden"
            value={numTurns}
            onChange={handleNumTurnsChange}
          />
          <TextInput
            label="Name des Spiels"
            description="Kursname zwecks Auswertung sinnvoll"
            value={gameName}
            onChange={(event) => setGameName(event.target.value)}
          />
        </ButtonModal>
        <Modal size={shortestDimension * 0.8} opened={isQrModalOpen} onClose={closeQrModal} title="QR Code" closeOnClickOutside={false}>
          <Center>
            <Stack gap="xl">
              <Text>Scanne den Code zum Beitreten.</Text>
              <QRCodeSVG value={`${window.location.host}/login/player/${qrGameID}`} size={shortestDimension * 0.6} />
            </Stack>
          </Center>
          <Space h="lg" />
        </Modal>
        <Container p={60} fluid>
          <Center px={120}>
            <Stack maw={1200} w={screenWidth - 120}>
              <Group justify="end">
                <Tooltip label ="Neues Spiel erstellen">
                <ActionIcon c="brand" size="lg" bg="transparent" onClick={openCreateModal}>
                  <IconSquarePlus />
                </ActionIcon>
                </Tooltip>
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
                exportToExcel={exportToExcel} 
              />
            </Stack>
          </Center>
        </Container>
      </>
  );
}
function shortestOf(screenHeight: number, screenWidth: number) {
  if (screenHeight > screenWidth){
    return screenWidth
  }
  else{
    return screenHeight
  }
}

