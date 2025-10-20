import "@ant-design/v5-patch-for-react-19" // Temporary patch for React 19 compatibility
import "./App.css"
import Home from "./pages/Home"
import { Routes, Route } from "react-router-dom"
import BookDetail from "./pages/BookDetail"
import CategoryBooks from "./pages/CategoryBooks"

import AuthProvider from "./contexts/AuthProvider"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import UserRoute from "./components/UserRoute"

import ManageAccount from "./pages/ManageAccount/ManageAccount"
import AccountInfoSection from "./pages/ManageAccount/AccountInfoSection"
import FavoritesSection from "./pages/ManageAccount/FavoritesSection"
import HistorySection from "./pages/ManageAccount/HistorySection"
import { PATHS } from "./constant/routePath"

import AdminDashboard from "./pages/Admin/AdminDashboard"
import AdminUsers from "./pages/Admin/AdminUsers"
import AdminBooks from "./pages/Admin/AdminBooks"
import AdminAddBook from "./pages/Admin/AdminAddbook"
import OAuthRedirect from "./pages/Auth/OAuthRedirect.jsx";
import AdminEditBook from "./pages/Admin/AdminEditbook"

import BookReader from "./pages/BookReader.jsx"
import EpubCoreViewer from "./pages/BookReader/BookReader.jsx"
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* User Routes - Admin will be redirected to /admin */}
        <Route 
          path="/" 
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          } 
        />
        <Route 
          path="/books/:id" 
          element={
            <UserRoute>
              <BookDetail />
            </UserRoute>
          } 
        />
        <Route 
          path={PATHS.CATEGORY} 
          element={
            <UserRoute>
              <CategoryBooks />
            </UserRoute>
          } 
        />
        <Route
          path={PATHS.MANAGE_ACCOUNT_REDIRECT.ROOT}
          element={
            <ProtectedRoute>
              <ManageAccount />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountInfoSection />} />
          <Route path={PATHS.MANAGE_ACCOUNT_CHILD.PROFILE} element={<AccountInfoSection />} />
          <Route path={PATHS.MANAGE_ACCOUNT_CHILD.FAVORITE_BOOKS} element={<FavoritesSection />} />
          <Route path={PATHS.MANAGE_ACCOUNT_CHILD.HISTORY_READING} element={<HistorySection />} />
        </Route>

        {/* Admin Routes - Protected by AdminRoute */}
        <Route
          path={PATHS.ADMIN.ROOT}
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.USERS}
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN.BOOKS}
          element={
            <AdminRoute>
              <AdminBooks />
            </AdminRoute>
          }
        />
        <Route 
          path={PATHS.ADMIN.ADD_BOOK} 
          element={
            <AdminRoute>
              <AdminAddBook />
            </AdminRoute>
          } 
        />
        <Route 
          path={PATHS.ADMIN.EDIT_BOOK} 
          element={
            <AdminRoute>
              <AdminEditBook />
            </AdminRoute>
          } 
        />
        
        {/* Other Routes */}
        <Route path="/oauth2/success" element={<OAuthRedirect />} />
        <Route path="/reader" element={<EpubCoreViewer />} />
      </Routes>
    </AuthProvider>
  )
}

export default App;