import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem('admin_token') === 'true'
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />
}
