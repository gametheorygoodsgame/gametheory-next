'use client';

import React from 'react';
import { Container, Flex, Title } from '@mantine/core';
import Image from 'next/image';

import gameTheoryLogo from 'public/GameTheory_Header.png';
import { useViewportSize } from '@mantine/hooks';
import { theme } from '@/utils/theme';

export default function PlayerMenuBar() {
  const { height: screenHeight, width: screenWidth } = useViewportSize();

  return (
    <Container bg="brand.7" fluid px={40} p={10}>
      <Flex align="center">
        <Image src={gameTheoryLogo} height={screenHeight < 980 ? 0.07*screenHeight : 70 } alt="." />
        {screenWidth > 980 ? (
          <Title style={theme.components?.Title?.styles.root}>Game Theory</Title>
        ) : (
          <></>
        )}
      </Flex>
    </Container>
  );
}
