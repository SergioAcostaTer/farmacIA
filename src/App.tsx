// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/layouts/Layout";
import { MedicationDetail } from "./pages/MedicationDetail";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/med/:id" element={<MedicationDetail />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;