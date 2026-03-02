import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { CartProvider } from './cart/CartContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AuthLayout } from './auth/AuthLayout'
import { LoginPage } from './auth/LoginPage'
import { RegisterPage } from './auth/RegisterPage'
import { DashboardLayout } from './dashboard/DashboardLayout'
import { DashboardHome } from './dashboard/DashboardHome'
import { ProductsPage } from './products/ProductsPage'
import { CartPage } from './cart/CartPage'
import { ProfilePage } from './profile/ProfilePage'
import { HomePage } from './landing/HomePage'
import { ThemeProvider } from './theme/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
            </Route>

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

