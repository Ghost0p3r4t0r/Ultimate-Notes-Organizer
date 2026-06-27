import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from './api';

export const itemsKeys = {
  list: (collectionId: string) => ['items', 'list', collectionId] as const,
  detail: (id: string) => ['items', 'detail', id] as const,
};

export function useItems(collectionId: string, params?: { page?: number; limit?: number; sort?: string; order?: string; search?: string; filters?: string }) {
  return useQuery({
    queryKey: [...itemsKeys.list(collectionId), params],
    queryFn: () => itemsApi.list(collectionId, params),
    enabled: !!collectionId,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: itemsKeys.detail(id),
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateItem(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.list(collectionId) });
    },
  });
}

export function useUpdateItem(id: string, collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof itemsApi.update>[1]) => itemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.list(collectionId) });
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(id) });
    },
  });
}

export function useDeleteItem(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.list(collectionId) });
    },
  });
}
