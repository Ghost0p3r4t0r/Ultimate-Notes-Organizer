import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/layouts/ProtectedRoute';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

const LoginPage = lazy(() => import('@/pages/Login').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/Register').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.DashboardPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFoundPage })));
const CollectionsPage = lazy(() => import('@/features/collections/pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('@/features/collections/pages/CollectionDetailPage').then(m => ({ default: m.CollectionDetailPage })));
const ItemDetailPage = lazy(() => import('@/features/items/pages/ItemDetailPage').then(m => ({ default: m.ItemDetailPage })));
const ComparePage = lazy(() => import('@/features/compare/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const FavoritesPage = lazy(() => import('@/features/favorites/pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          }>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:id" element={<CollectionDetailPage />} />
                  <Route path="/items/:id" element={<ItemDetailPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/search" element={<div>Search</div>} />
                  <Route path="/settings" element={<div>Settings</div>} />
                </Route>
              </Route>
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastViewport />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
