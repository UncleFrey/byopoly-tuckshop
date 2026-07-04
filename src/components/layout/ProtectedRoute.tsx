import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';
import type { UserRole } from '../../types';

export function ProtectedRoute({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: UserRole;
}) {
  const { session, profile, loading } = useAuth();

  if (loading) return <Spinner label="Checking your session…" />;
  if (!session || !profile) return <Navigate to="/staff-login" replace />;
  if (requireRole && profile.role !== requireRole && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
