import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Client, Reservation, Space } from '../types';
import { mockClients, mockReservations, generateSpaces } from '../data/mockData';

interface AppContextType {
  clients: Client[];
  reservations: Reservation[];
  spaces: Space[];
  addClient: (client: Client) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  refreshSpaces: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [spaces, setSpaces] = useState<Space[]>([]);

  const refreshSpaces = () => {
    setSpaces(generateSpaces());
  };

  useEffect(() => {
    refreshSpaces();
  }, [reservations]);

  const addClient = (client: Client) => {
    setClients((prev) => [...prev, client]);
  };

  const addReservation = (reservation: Reservation) => {
    setReservations((prev) => [...prev, reservation]);
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        reservations,
        spaces,
        addClient,
        addReservation,
        updateReservation,
        deleteReservation,
        refreshSpaces,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
