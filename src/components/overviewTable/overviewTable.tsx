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

type OverviewTableProps = {
  games: Game[];
  handleOpenButtonClick: (gameID: string) => void;
  handleDeleteButtonClick: (gameID: string) => void;
  handleClipboardButtonClick: (event: React.MouseEvent<HTMLElement>, gameID: string) => void;
  clipboardClicked: boolean;
  clipboardGameID: string | null;
  handleQRButtonClick: (gameID: string) => void;
  handleRowClick: (gameID: string, event: React.MouseEvent) => void;
};

export function OverviewTable({
  games,
  handleOpenButtonClick,
  handleDeleteButtonClick,
  handleClipboardButtonClick,
  clipboardClicked,
  clipboardGameID,
  handleQRButtonClick,
  handleRowClick,
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
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
