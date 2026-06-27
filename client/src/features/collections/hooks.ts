import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from './api';
import type { Collection } from './types';

export const collectionsKeys = {
  all: ['collections'] as const,
  list: () => [...collectionsKeys.all, 'list'] as const,
  detail: (id: string) => [...collectionsKeys.all, 'detail', id] as const,
};

export function useCollections() {
  return useQuery({
    queryKey: collectionsKeys.list(),
    queryFn: collectionsApi.list,
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: collectionsKeys.detail(id),
    queryFn: () => collectionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collectionsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collectionsKeys.list() }),
  });
}

export function useUpdateCollection(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof collectionsApi.update>[1]) => collectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionsKeys.list() });
      queryClient.invalidateQueries({ queryKey: collectionsKeys.detail(id) });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collectionsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collectionsKeys.list() }),
  });
}
