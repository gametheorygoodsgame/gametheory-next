'use client';

import { useEffect, useState } from 'react';
import DataCollectionList, {
  DataCollectionItem,
} from '@/components/dataCollection/dataCollectionList';
import { logger } from '@/utils/logger';

interface DataCollectionProps {
  gameId: string;
}

export default function DataCollection({ gameId }: DataCollectionProps) {
  const [dataCollection, setDataCollection] = useState<DataCollectionItem[]>([]);

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
        logger.error('Error fetching data: ', error);
      }
    };

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
