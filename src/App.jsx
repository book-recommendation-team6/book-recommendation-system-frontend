import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import {Routes, Route} from 'react-router-dom'
import BookDetail from './pages/BookDetail'
import BookReader from './pages/BookReader';
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/reader/:id" element={<BookReader />} />
    </Routes>
    </>
  )
}

export default App
