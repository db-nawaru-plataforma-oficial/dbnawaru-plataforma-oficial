import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Acceso from './pages/Acceso'
import Home from './pages/Home'
import Reinos from './pages/Reinos'
import Personajes from './pages/Personajes'
import Razas from './pages/Razas'
import AnimalesEspirituales from './pages/AnimalesEspirituales'
import Mapas from './pages/Mapas'
import PoderesElementales from './pages/PoderesElementales'
import Layout from './Layout'

function ProtectedRoute({ children, pageName }) {
  const role = sessionStorage.getItem('app_role')
  if (!role) return <Navigate to="/acceso" replace />
  return <Layout currentPageName={pageName}>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/acceso" element={<Acceso />} />
      <Route path="/" element={<ProtectedRoute pageName="Home"><Home /></ProtectedRoute>} />
      <Route path="/reinos" element={<ProtectedRoute pageName="Reinos"><Reinos /></ProtectedRoute>} />
      <Route path="/personajes" element={<ProtectedRoute pageName="Personajes"><Personajes /></ProtectedRoute>} />
      <Route path="/razas" element={<ProtectedRoute pageName="Razas"><Razas /></ProtectedRoute>} />
      <Route path="/animales" element={<ProtectedRoute pageName="AnimalesEspirituales"><AnimalesEspirituales /></ProtectedRoute>} />
      <Route path="/mapas" element={<ProtectedRoute pageName="Mapas"><Mapas /></ProtectedRoute>} />
      <Route path="/poderes" element={<ProtectedRoute pageName="PoderesElementales"><PoderesElementales /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
