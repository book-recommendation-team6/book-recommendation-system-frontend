import React from 'react';
import '@ant-design/v5-patch-for-react-19'; // Temporary patch for React 19 compatibility
import './App.css'
import Home from './pages/Home'
import {Routes, Route} from 'react-router-dom'
import BookDetail from './pages/BookDetail'
import ManageAccount from './pages/ManageAccount'
import  AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
function App() {

  return (
   <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <ManageAccount />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
