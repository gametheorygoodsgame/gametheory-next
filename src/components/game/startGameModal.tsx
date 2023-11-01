import { Button, Group, Modal, NumberInput, Stack } from '@mantine/core';
import React from 'react';

export function StartGameModal({
                            currentRound,
                            isOpen,
                            handleNextRound,
                            redCardValue,
                            setRedCardValue,
                            close,
                        }: {
    currentRound: number;
    isOpen: boolean;
    handleNextRound: () => void;
    redCardValue: string | number;
    setRedCardValue: (value: string | number) => void;
    close: () => void;
}) {
    return (
        <Modal
          opened={isOpen}
          onClose={close}
          title={currentRound === 0 ? 'Spiel Starten' : 'Nächste Runde'}
        >
            <Stack gap="xl">
                <NumberInput
                  type="text"
                  label="Roter Kartenwert"
                  value={redCardValue}
                  onChange={(value: string | number) => setRedCardValue(value)}
                />

                <Group align="right">
                    {currentRound === 0 ? (
                        <Button bg="brand.0" onClick={handleNextRound}>
                            Spiel Starten
                        </Button>
                    ) : (
                        <Button onClick={handleNextRound}>Nächste Runde</Button>
                    )}
                </Group>
            </Stack>
        </Modal>
    );
}
