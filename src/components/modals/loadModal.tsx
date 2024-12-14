import {Center, Container, Group, Loader, Modal, Stack, Text} from "@mantine/core";
import React from "react";

interface LoadModalProps {
    children?: React.ReactNode;
    opened: boolean;
    onClose: () => void;
    title?: string;
}

/**
 * A modal component that displays a loading state with an optional title and custom content.
 * The modal contains a loader and renders its children inside a styled container.
 * 
 * 
 * @param {LoadModalProps} props - The props for the LoadModal component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the modal.
 * @param {boolean} props.opened - A boolean that controls whether the modal is open or closed.
 * @param {Function} props.onClose - A function that is called when the modal is closed.
 * @param {string} [props.title] - An optional title for the modal.
 * 
 * @returns {JSX.Element} A modal that shows a loading state with an optional title and custom content.
 */
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