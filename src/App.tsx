// App.jsx
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/layouts/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;
