import "@ant-design/v5-patch-for-react-19" // Temporary patch for React 19 compatibility
import "./App.css"
import Home from "./pages/Home"
import { Routes, Route } from "react-router-dom"
import BookDetail from "./pages/BookDetail"

import AuthProvider from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

import ManageAccount from "./pages/ManageAccount/ManageAccount"
import AccountInfoSection from "./pages/ManageAccount/AccountInfoSection"
import FavoritesSection from "./pages/ManageAccount/FavoritesSection"
import HistorySection from "./pages/ManageAccount/HistorySection"
import { PATHS } from "./constant/routePath"

import AdminDashboard from "./pages/Admin/AdminDashboard"
import AdminUsers from "./pages/Admin/AdminUsers"
import AdminBooks from "./pages/Admin/AdminBooks"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route
          path={PATHS.MANAGE_ACCOUNT_REDIRECT.ROOT}
          element={
            <ProtectedRoute>
              {" "}
              <ManageAccount />{" "}
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountInfoSection />} />
          <Route path={PATHS.MANAGE_ACCOUNT_CHILD.PROFILE} element={<AccountInfoSection />} />
          <Route path={PATHS.MANAGE_ACCOUNT_CHILD.FAVORITE_BOOKS} element={<FavoritesSection />} />
          <Route path={PATHS.MANAGE_ACCOUNT_CHILD.HISTORY_READING} element={<HistorySection />} />
        </Route>

        <Route
          path={PATHS.ADMIN.ROOT}
          element={
              <AdminDashboard />
          }
        />
        <Route
          path={PATHS.ADMIN.USERS}
          element={
              <AdminUsers />
          }
        />
        <Route
          path={PATHS.ADMIN.BOOKS}
          element={
              <AdminBooks />
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App