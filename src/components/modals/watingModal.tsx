import React, {ReactNode} from 'react';
import { Modal, Stack, Text, Loader } from '@mantine/core';

type WaitingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    text: ReactNode;
};

const WaitingModal: React.FC<WaitingModalProps> = ({ isOpen, onClose, text }) => (
    <Modal opened={isOpen} onClose={onClose} centered withCloseButton={false}>
        <Stack align="center" justify="center">
            <Text ff="Instrument Sans, sans-serif" fz={18} fw={700} p={40} className="lbl-round">
                {text}
            </Text>
            <Loader variant="dots" />
        </Stack>
    </Modal>
);

export default WaitingModal;
