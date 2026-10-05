import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Archive from './pages/Archive';
import ContentStudio from './pages/ContentStudio';
import ExpeditionsIndex from './pages/ExpeditionsIndex';
import ExpeditionDetail from './pages/ExpeditionDetail';
import About from './pages/About';
import Sources from './pages/Sources';
import Credits from './pages/Credits';
import NotFound from './pages/NotFound';

function ExpeditionRedirect() {
  const { id } = useParams();
  return <Navigate to={`/expeditions/${id}`} replace />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/expeditions" element={<ExpeditionsIndex />} />
        <Route path="/expeditions/:id" element={<ExpeditionDetail />} />
        <Route path="/expedition/:id" element={<ExpeditionRedirect />} />
        <Route path="/studio" element={<ContentStudio />} />
        <Route path="/studio/:id" element={<ContentStudio />} />
        <Route path="/content-studio" element={<Navigate to="/studio" replace />} />
        <Route path="/content-studio/:id" element={<ContentStudio />} />
        <Route path="/about" element={<About />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
