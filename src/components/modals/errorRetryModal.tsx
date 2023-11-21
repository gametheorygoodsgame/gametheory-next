import React, {ReactNode} from 'react';
import { Modal, Stack, Text, Group, Button } from '@mantine/core';
import {router} from "next/client";

type ErrorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onRetry: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, onRetry }) => (
    <Modal opened={isOpen} onClose={onClose} title="Fehler">
        <Stack gap="xl" align="center">
            <Text>Spiel wurde nicht gefunden!</Text>
            <Group>
                <Button onClick={() => router.push('/login/player')}>Zurück zum Login</Button>
                <Button onClick={() => { onClose(); onRetry(); }}>Erneut senden</Button>
            </Group>
        </Stack>
    </Modal>
);

export default ErrorModal;
