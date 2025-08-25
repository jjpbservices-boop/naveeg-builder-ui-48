import { Outlet, Navigate } from '@tanstack/react-router';
import { useAuth } from '@/integrations/supabase/auth';

export default function Dashboard() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <div className="min-h-screen"><Outlet /></div>;
}