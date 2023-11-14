import { Game } from '@gametheorygoodsgame/gametheory-openapi';
import { ActionIcon, Group, Table } from '@mantine/core';
import {
  IconClipboard,
  IconClipboardCheck,
  IconDoorEnter,
  IconQrcode,
  IconTrash,
} from '@tabler/icons-react';
import React from 'react';

type OverviewTableProps = {
  games: Game[];
  handleOpenButtonClick: (gameID: string) => void;
  handleDeleteButtonClick: (gameID: string) => void;
  handleClipboardButtonClick: (event: React.MouseEvent<HTMLElement>, gameID: string) => void;
  clipboardClicked: boolean;
  clipboardGameID: string | null;
  handleQRButtonClick: (gameID: string) => void;
};

export function OverviewTable({
  games,
  handleOpenButtonClick,
  handleDeleteButtonClick,
  handleClipboardButtonClick,
  clipboardClicked,
  clipboardGameID,
  handleQRButtonClick,
}: OverviewTableProps) {
  const tableHeaders = [
    { label: 'Spiel-ID', dataKey: 'id' },
    { label: 'Anzahl der Spieler', dataKey: 'players.length' },
    { label: 'Runden', dataKey: 'currentTurn' },
    // Add more headers as needed
  ];

  function getNestedValue(obj: any, path: string) {
    const keys = path.split('.');
    return keys.reduce((acc, key) => acc && acc[key], obj);
  }

  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {tableHeaders.map((header) => (
            <Table.Th key={header.label}>{header.label}</Table.Th>
          ))}
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {games.map((game: Game) => (
          <Table.Tr className="noselect" key={game.id}>
            <Table.Td className="mantine-icon">
              <ActionIcon color="green" className="mantne-icon">
                <IconDoorEnter
                  className="mantine-icon"
                  onClick={() => handleOpenButtonClick(game.id)}
                />
              </ActionIcon>
            </Table.Td>
            {tableHeaders.map((header) => (
              <Table.Td key={header.dataKey}>
                {header.dataKey === 'currentTurn'
                  ? `${getNestedValue(game, 'currentTurn')} / ${getNestedValue(game, 'numTurns')}`
                  : getNestedValue(game, header.dataKey)}
              </Table.Td>
            ))}
            <Table.Td className="mantine-icon">
              <Group className="mantine-icon">
                <ActionIcon color="red" className="mantine-icon">
                  <IconTrash
                    className="mantine-icon"
                    onClick={() => handleDeleteButtonClick(game.id)}
                  />
                </ActionIcon>
                <ActionIcon
                  className="mantine-icon"
                  onClick={(event) => handleClipboardButtonClick(event, game.id)}
                >
                  {clipboardClicked && game.id === clipboardGameID ? (
                    <IconClipboardCheck color="green" className="mantine-icon" />
                  ) : (
                    <IconClipboard className="mantine-icon" />
                  )}
                </ActionIcon>
                <ActionIcon className="mantine-icon">
                  <IconQrcode
                    className="mantine-icon"
                    onClick={() => handleQRButtonClick(game.id)}
                  />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
