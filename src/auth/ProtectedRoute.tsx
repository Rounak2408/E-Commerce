import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

type Props = {
  children: React.ReactElement
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  return children
}

