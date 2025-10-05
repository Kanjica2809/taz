import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_cadastro?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ NOVA FUNÇÃO: Verificar autenticação com a API
  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/perfil.php', {
        method: 'GET',
        credentials: 'include' // Importante para enviar cookies/sessão
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id.toString(),
          nome: userData.nome,
          email: userData.email,
          telefone: userData.telefone,
          endereco: userData.endereco,
          data_cadastro: userData.data_cadastro
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  };

  useEffect(() => {
    // Verificar autenticação ao carregar
    checkAuth();
  }, []);

  const login = (userData: User) => {
    const user: User = {
      id: userData.id.toString(),
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      endereco: userData.endereco,
      data_cadastro: userData.data_cadastro
    };
    
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Fazer logout na API também
    try {
      await fetch('/api/logout.php', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};