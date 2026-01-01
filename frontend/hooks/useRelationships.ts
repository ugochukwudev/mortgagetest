import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Relationship } from '@/types/relationship';

export function useRelationships() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRelationships = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ relationships: Relationship[] }>('/relationships');
      setRelationships(response.relationships || []);
    } catch (error) {
      console.error('Error loading relationships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRelationships();
  }, []);

  return {
    relationships,
    isLoading,
    refetch: loadRelationships,
  };
}

