import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddBoarding from './pages/AddBoarding';
import BoardingDetails from './pages/BoardingDetails';
import FindBoarding from './pages/FindBoarding';
import Home from './pages/Home';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<FindBoarding />} />
          <Route path="/boardings/:id" element={<BoardingDetails />} />
          <Route path="/add" element={<AddBoarding />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
