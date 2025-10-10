import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import {Routes, Route} from 'react-router-dom'
import BookDetail from './pages/BookDetail'
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/account" element={<ManageAccount />} />
    </Routes>
    </>
  )
}

export default App
