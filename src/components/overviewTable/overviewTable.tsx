import { Game } from '@gametheorygoodsgame/gametheory-openapi';
import { ActionIcon, Group, Table, Tooltip } from '@mantine/core';
import {
  IconClipboard,
  IconClipboardCheck,
  IconQrcode,
  IconTrash,
  IconPlayerPlay,
} from '@tabler/icons-react';
import React from 'react';
import classes from './overviewTable.module.css';
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";

type OverviewTableProps = {
  games: Game[];
  handleOpenButtonClick: (gameID: string) => void;
  handleDeleteButtonClick: (gameID: string) => void;
  handleClipboardButtonClick: (event: React.MouseEvent<HTMLElement>, gameID: string) => void;
  clipboardClicked: boolean;
  clipboardGameID: string | null;
  handleQRButtonClick: (gameID: string) => void;
  handleRowClick: (gameID: string, event: React.MouseEvent) => void;
  exportToExcel: (game: Game) => void;
};

/**
 * A component that renders a table displaying an overview of multiple games.
 * The table includes actions such as opening a game, deleting a game, copying the game link to the clipboard,
 * and generating a QR code for a game. It also supports exporting game data to Excel.
 *
 * @component
 * 
 * @param {OverviewTableProps} props - The props for the OverviewTable component.
 * @param {Game[]} props.games - An array of game objects to display in the table.
 * @param {Function} props.handleOpenButtonClick - A function to handle the opening of a game when the corresponding button is clicked.
 * @param {Function} props.handleDeleteButtonClick - A function to handle the deletion of a game when the corresponding button is clicked.
 * @param {Function} props.handleClipboardButtonClick - A function to handle copying the game link to the clipboard.
 * @param {boolean} props.clipboardClicked - A flag indicating whether the clipboard has been clicked for a specific game.
 * @param {string} props.clipboardGameID - The ID of the game that has been copied to the clipboard.
 * @param {Function} props.handleQRButtonClick - A function to handle the generation of a QR code for a specific game.
 * @param {Function} props.handleRowClick - A function to handle row click events, typically for navigating to a game.
 * @param {Function} props.exportToExcel - A function to export the table data to an Excel file.
 * 
 * @returns {JSX.Element} A table rendering game overview with action buttons and clipboard functionality.
 */
export function OverviewTable({
  games,
  handleOpenButtonClick,
  handleDeleteButtonClick,
  handleClipboardButtonClick,
  clipboardClicked,
  clipboardGameID,
  handleQRButtonClick,
  handleRowClick,
  exportToExcel,
}: OverviewTableProps) {
  const tableHeaders = [
    { label: '', dataKey:''}, //empty header for first column
    { label: 'Spiel-Titel', dataKey: 'name' },
    { label: 'Anzahl der Spieler', dataKey: 'players.length' },
    { label: 'Runden', dataKey: 'currentTurn' },
  ];

  function getNestedValue(obj: any, path: string) {
    const keys = path.split('.');
    return keys.reduce((acc, key) => acc && acc[key], obj);
  }

  const renderClipboardIcon = (gameId: string) => {
    if (clipboardClicked && gameId === clipboardGameID) {
      return <IconClipboardCheck className={`mantine-icon ${classes.green}`} />;
    }
    return <Tooltip label = "Link kopieren"><IconClipboard className={`mantine-icon ${classes.brand}`} /></Tooltip>;
  };

  return (
    <>
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {tableHeaders.map((header) => (
            <Table.Th key={header.label}>{header.label}</Table.Th>
          ))}
          <Table.Th/>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {games.map((game: Game) => (
          <Table.Tr className={classes.noselect} key={game.id} onDoubleClick={(event) => handleRowClick(game.id, event)}>
            <Table.Td className="mantine-icon">
              <ActionIcon className="mantine-icon" variant="transparent">
                <Tooltip label="Spiel betreten">
                <IconPlayerPlay
                  className={`mantine-icon ${classes.green}`}
                  onClick={() => handleOpenButtonClick(game.id)}
                />
                </Tooltip>
              </ActionIcon>
            </Table.Td>
            {tableHeaders.map((header, index) => (
              index === 0 ? null : //skip first empty table entry
              <Table.Td key={header.dataKey}>
                  {header.dataKey === 'currentTurn'
                    ? `${getNestedValue(game, 'currentTurn')} / ${getNestedValue(game, 'numTurns')}`
                    : getNestedValue(game, header.dataKey)}
              </Table.Td>
            ))}
            <Table.Td className="mantine-icon">
              <Group className="mantine-icon">
                <ActionIcon className="mantine-icon" variant="transparent">
                  <Tooltip label="Spiel löschen">
                  <IconTrash
                    className={`mantine-icon ${classes.red}`}
                    onClick={() => handleDeleteButtonClick(game.id)}
                  />
                  </Tooltip>
                </ActionIcon>
                <ActionIcon
                  className="mantine-icon"
                  variant="transparent"
                  onClick={(event) => handleClipboardButtonClick(event, game.id)}
                >
                  {renderClipboardIcon(game.id)}
                </ActionIcon>
                <ActionIcon className="mantine-icon" variant="transparent">
                  <Tooltip label="QR Code anzeigen">
                  <IconQrcode
                    className={`mantine-icon ${classes.brand}`}
                    onClick={() => handleQRButtonClick(game.id)}
                  />
                  </Tooltip>
                </ActionIcon>
                <Tooltip label="Als Tabelle exportieren">
                  <ActionIcon className="mantine-icon" variant="transparent"
                    onClick={() => exportToExcel(game)} 
                  >
                    <PiMicrosoftExcelLogoBold style={{ fontSize: '22px' }}/>
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </>
  );
}
