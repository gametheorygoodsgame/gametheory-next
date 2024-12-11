'use client';

import React from 'react';
import { Badge, Stack, Text, px } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';

/**
 * Komponente PlayerList
 * 
 * Diese Komponente zeigt die Liste der Spieler eines Spiels an und wählt zufällig einen Gewinner aus. 
 * Der Gewinner wird zusammen mit einer Trophäe in einem Badge angezeigt.
 * 
 * @param {Object} props - Eigenschaften der Komponente.
 * @param {Game | undefined} props.game - Das Spielobjekt, das die Spieler enthält. Kann undefined sein, falls kein Spiel verfügbar ist.
 * 
 * @returns {JSX.Element} Ein Stack-Element, das den Gewinner des Spiels in einem Badge anzeigt. 
 * Wenn keine Spieler vorhanden sind, wird "Niemand" als Gewinner angezeigt.
 * 
 * ## Funktionen:
 * 
 * - `getRandomNumber(min: number, max: number): number`:
 *    - Generiert eine zufällige Ganzzahl im Bereich `[min, max]`.
 * 
 * - `getWinnerFromPlayers(): Player | null`:
 *    - Wählt zufällig einen Gewinner aus der Liste der Spieler aus.
 *    - Gibt `null` zurück, wenn keine Spieler verfügbar sind.
 * 
 * ## Abhängigkeiten:
 * - Verwendet die `IconTrophy`-Komponente für die Darstellung der Trophäe.
 * - Nutzt die Komponenten `Stack`, `Text` und `Badge` für das Layout und Styling.
 */
export default function PlayerList({ game }: { game: Game | undefined; }) {
    
    const trophy = <IconTrophy color='gold' size={32}/>;
  
    const allPlayers = game?.players
    console.log(allPlayers)
    const getRandomNumber = (min: number, max: number) =>{
        return Math.floor(Math.random()*(max-min+1)) + min;
    }

    function getWinnerFromPlayers(){
        if(allPlayers && allPlayers.length > 0){
            const winner = allPlayers[getRandomNumber(0, allPlayers.length - 1)]
            return winner;
        }else{
            return null;
        }
    }

    const winner = getWinnerFromPlayers();
    
    return(
        <Stack>
            <Text style={{textAlign:'center'}}>
                Gewinner des Spiels : 
            </Text>
            <Badge
                fullWidth
                leftSection = {trophy}
                rightSection = {trophy}
                color='#334d80'
                size='xl'
                >
                {winner ? winner.name : 'Niemand'}
            </Badge>
        </Stack>
    ); 
}