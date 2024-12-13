'use client';

import React from 'react';
import { ActionIcon, Container, Flex, Group, Menu, Title } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { getAuth, signOut } from 'firebase/auth';
import { useViewportSize } from '@mantine/hooks';
import Image from 'next/image';
import gameTheoryLogo from 'public/GameTheory_Header.png';
import { firebase } from '@/utils/firebaseApp';
import { theme } from '@/utils/theme';

/**
 * A dropdown menu component for settings.
 * 
 * @param {Object} props - The component props.
 * @param {any} props.auth - The authentication object used for logging out the user.
 * @returns {JSX.Element} The menu component as a dropdown.
 */
function MenuDropdown({ auth }: { auth: any }) {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon c="white">
          <IconUser size="5rem" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Einstellungen</Menu.Label>
        <Menu.Item leftSection={<IconLogout size={14} />} onClick={() => signOut(auth)}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
/**
 * A navigation bar for the Game Master interface.
 * 
 * @returns {JSX.Element} Game Master navigation bar.
 */
export default function GameMasterMenuBar() {
  const auth = getAuth(firebase);
  const { width: screenWidth } = useViewportSize();

  return (
    <Container bg="brand.7" fluid px={40} p={10}>
      <Group justify="space-between" align="center">
        <Flex align="center">
          <Image src={gameTheoryLogo} height={70} alt="." />
          {screenWidth > 980 ? (
            <Title style={theme.components?.Title?.styles.left}>Game Theory</Title>
          ) : (
            <></>
          )}
        </Flex>
        <MenuDropdown auth={auth} />
      </Group>
    </Container>
  );
}
