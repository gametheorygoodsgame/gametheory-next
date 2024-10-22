import { Game, Move, Player } from '@gametheorygoodsgame/gametheory-openapi';
import { ActionIcon, Group, Table, Tooltip, Button } from '@mantine/core';
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
import * as XLSX from 'xlsx';

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



  const exportToExcel = (game: Game) => {


    const calculateColumnWidths = (data: { [key: string]: any }[]) => {
        const colWidths: number[] = [];

        if (data.length > 0) {
            Object.keys(data[0]).forEach((col, i) => {
                colWidths[i] = col.length;
            });
        }
        data.forEach(row => {
            Object.keys(row).forEach((col, i) => {
                const value = row[col] ? row[col].toString() : ""; 
                const length = value.length;

                if (length > colWidths[i]) {
                    colWidths[i] = length;
                }
            });
        });
        return colWidths.map(w => ({
            wch: Math.max(w, 14)
        }));
    };

    
    const wb = XLSX.utils.book_new();
    const generalData: { [key: string]: any }[] = [];
    const playerBalances: { name: string, balance: number, data: { [key: string]: any }[] }[] = [];

    game.players.forEach((player: Player) => {
        let balance = 0;
        const playerData: { [key: string]: any }[] = [];

        for (let turn = 1; turn <= game.numTurns; turn++) {

            const cardValue = game.cardHandValue[turn];
            let numRedCards = 0;
            let potRedCards = 0;

            const move = player.moves.find((m: Move) => m.numTurn === turn);
            if (move) {
                numRedCards = move.numRedCards;
            }
            game.players.forEach(p => {
                const pMove = p.moves.find((m: Move) => m.numTurn === turn);
                if (pMove) {
                    potRedCards += pMove.numRedCards;
                }
            });
            const remainingRedCards = 2 - numRedCards;
            balance += (remainingRedCards * cardValue) + potRedCards;

            const rowData: { [key: string]: any } = {
                "Runde": turn,
                "Kartenwert": cardValue,
                "Rote Karten im Pot": potRedCards,
                "abgegebene Rote Karten": numRedCards,
                "Kontostand": balance
            };

            playerData.push(rowData);
        }
        playerBalances.push({ name: player.name, balance, data: playerData });
    });
    playerBalances.sort((a, b) => b.balance - a.balance);

    generalData.push({
        "Spiel-Titel": game.name,
        "Anzahl der Runden": game.numTurns,
        "Anzahl der Spieler": game.players.length,
        "": "",
        "Spielername": "",
        "Kontostand": "",
    });
    playerBalances.forEach(pb => {
        generalData.push({
            "Spielername": pb.name,
            "Kontostand": pb.balance
        });
    });
    const generalSheet = XLSX.utils.json_to_sheet(generalData);
    generalSheet['!cols'] = calculateColumnWidths(generalData);

    XLSX.utils.book_append_sheet(wb, generalSheet, "Spiel-Info");

    playerBalances.forEach(pb => {
      const playerSheet = XLSX.utils.json_to_sheet(pb.data);
      playerSheet['!cols'] = calculateColumnWidths(pb.data); 

      XLSX.utils.book_append_sheet(wb, playerSheet, pb.name);
    });

    XLSX.writeFile(wb, game.name + ".xlsx");
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
