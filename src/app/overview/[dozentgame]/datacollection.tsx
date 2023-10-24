"use client"

import React, { useState, useEffect } from "react";
import { Badge, Stack } from "@mantine/core";
import { IconCards } from "@tabler/icons-react";

export default function DataCollection({ gameId }) {
    const [dataCollection, setDataCollection] = useState([]);
    const icon = (<IconCards />);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`../api/playerList?gameID=${gameId}`);
                if (response.status === 404) {
                    throw new Error('Game not found');
                }
                const data = await response.json();
                setDataCollection(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();

        const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId);
    }, [gameId]);

    if (dataCollection.length === 0) {
        return <div>Loading...</div>;
    }

    type Item = {
        id: string;
        name: string;
    }

    return (
        <>
            <Stack>
                {dataCollection.map((item: Item) => (
                    <Badge leftSection={icon} h={50} w={200} size="xl" radius="md" color="indigo" key={item.id}>{item.name}</Badge>
                ))}
            </Stack>
        </>
    );
}
