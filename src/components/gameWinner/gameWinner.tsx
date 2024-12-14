'use client';

import React from 'react';
import { Badge, Stack, Text, px } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import { Game } from '@gametheorygoodsgame/gametheory-openapi';

/**
 * A component that displays the list of players in a game and randomly selects a winner.
 * The winner's name is displayed with a trophy icon. If no players are present, "Niemand" is shown.
 * 
 * @param {Object} props - The props for the PlayerList component.
 * @param {Game | undefined} props.game - The game object containing the list of players. If undefined, no winner can be selected.
 * 
 * @returns {JSX.Element} A component that shows the winner's name and a trophy icon or "Niemand" if no players are present.
 * 
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