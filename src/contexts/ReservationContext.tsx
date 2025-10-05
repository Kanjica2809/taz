import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Reservation {
  id: string;
  apartment: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'Pagamento aprovado' | 'Pendente';
  name: string;
  email: string;
  phone: string;
  totalPrice: number;
  createdAt: string;
  // Informações de reserva
  cpf?: string;
  address?: string;
  number?: string;
  zipCode?: string;
  isContract?: boolean;
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (id: string, status: 'Pagamento aprovado' | 'Pendente') => void;
  removeReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Carregar reservas do localStorage ao inicializar
  useEffect(() => {
    const savedReservations = localStorage.getItem('gf-reservations');
    if (savedReservations) {
      try {
        setReservations(JSON.parse(savedReservations));
      } catch (error) {
        console.error('Erro ao carregar reservas do localStorage:', error);
      }
    }
  }, []);

  // Salvar reservas no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('gf-reservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'Pendente'
    };

    setReservations(prev => [newReservation, ...prev]);
  };

  const updateReservationStatus = (id: string, status: 'Pagamento aprovado' | 'Pendente') => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
  };

  const removeReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  return (
    <ReservationContext.Provider 
      value={{ 
        reservations, 
        addReservation, 
        updateReservationStatus, 
        removeReservation 
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};