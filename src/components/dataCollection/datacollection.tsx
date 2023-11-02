'use client';

import { useEffect, useState } from 'react';
import { GamePlayerApi } from '@eikermannlfh/gametheoryapi/api';
import DataCollectionList, {
  DataCollectionItem,
} from '@/components/dataCollection/dataCollectionList';
import { logger } from '@/utils/logger';

interface DataCollectionProps {
  gameId: string;
}

export default function DataCollection({ gameId }: DataCollectionProps) {
  const [dataCollection, setDataCollection] = useState<DataCollectionItem[]>([]);

  const gamePlayerApi = new GamePlayerApi();

  const fetchData = async () => {
    try {
      const response = await gamePlayerApi.getPlayersByGameId(gameId);
      if (response.status === 404) {
        throw new Error('Game not found');
      }
      setDataCollection(response.data);
    } catch (error) {
      logger.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, [gameId]);

  if (dataCollection.length === 0) {
    return <div>Loading...</div>;
  }

  // Render the DataCollectionList component with the fetched data
  return <DataCollectionList dataCollection={dataCollection} />;
}
