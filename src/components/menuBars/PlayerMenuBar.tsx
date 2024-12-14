'use client';

import React from 'react';
import { Container, Flex, Title } from '@mantine/core';
import Image from 'next/image';

import gameTheoryLogo from 'public/GameTheory_Header.png';
import { useViewportSize } from '@mantine/hooks';
import { theme } from '@/utils/theme';

/**
 * A component that renders a menu bar for the player, displaying a logo and title.
 * The title is only displayed if the screen width is larger than 439 pixels. 
 * It uses the `useViewportSize` hook to determine the screen width and conditionally render the title.
 * 
 * @returns {JSX.Element} A container with a logo and title, responsive to screen size.
 * 
 */
export default function PlayerMenuBar() {
  const { width: screenWidth } = useViewportSize();

  return (
    <Container bg="brand.7" fluid px={40} p={10}>
        <Flex align="center">
            <Image src={gameTheoryLogo} height={70} alt="." />
            {screenWidth > 439 ? (
                <Title style={theme.components?.Title?.styles.left}>Game Theory</Title>
            ) : (
                <></>
            )}
        </Flex>
    </Container>
  );
}
