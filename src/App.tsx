import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Spaces } from './pages/Spaces';
import { Clients } from './pages/Clients';
import { Reservations } from './pages/Reservations';
import { NewReservation } from './pages/NewReservation';
import { Tickets } from './pages/Tickets';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/spaces" element={<Spaces />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/new-reservation" element={<NewReservation />} />
            <Route path="/tickets" element={<Tickets />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
