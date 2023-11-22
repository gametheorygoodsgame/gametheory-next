import {Center, Container, Group, Loader, Modal, Stack, Text} from "@mantine/core";
import React from "react";

interface LoadModalProps {
    children?: React.ReactNode;
    opened: boolean;
    onClose: () => void;
    title?: string;
}

export default function LoadModal({ children, opened, onClose, title }: LoadModalProps)  {
    return(
        <Modal opened={opened} onClose={onClose} centered withCloseButton={false} title={title} closeOnClickOutside={false}>
            <Container>
                <Stack fz={18} fw={700} p={40} className="lbl-round">
                    {children}
                </Stack>
                <Center>
                    <Loader/>
                </Center>
            </Container>
        </Modal>
    );
}