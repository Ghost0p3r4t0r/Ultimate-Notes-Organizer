import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { DashboardPage } from '@/pages/Dashboard';
import { NotFoundPage } from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/layouts/ProtectedRoute';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { CollectionsPage } from '@/features/collections/pages/CollectionsPage';
import { CollectionDetailPage } from '@/features/collections/pages/CollectionDetailPage';
import { ItemDetailPage } from '@/features/items/pages/ItemDetailPage';
import { ComparePage } from '@/features/compare/pages/ComparePage';

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
                <Route path="/favorites" element={<div>Favorites</div>} />
                <Route path="/search" element={<div>Search</div>} />
                <Route path="/settings" element={<div>Settings</div>} />
              </Route>
            </Route>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastViewport />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
