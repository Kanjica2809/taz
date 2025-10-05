import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  MapPin,
  LogOut,
  Home,
  Building2,
  Mail,
  CreditCard,
  Shield,
  Eye,
  User,
  Phone,
  Map
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Reserva {
  id: number;
  apartamento_id: string;
  apartamento_nome: string;
  data_entrada: string;
  data_saida: string;
  valor_total: number;
  status: string;
  dados_pessoais: string;
  endereco_completo: string;
  data_reserva: string;
}

interface Cartao {
  id: number;
  numero: string;
  titular: string;
  validade: string;
  cvv: string;
  data_cadastro: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reserva | null>(null);
  const [detailsReservation, setDetailsReservation] = useState<Reserva | null>(null);

  // Estados para modais
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [digitLength, setDigitLength] = useState<number>(4);
  const [codeDigits, setCodeDigits] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dados pagamento
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    cpf: ''
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // Carregar dados do usuário, reservas e cartões
  useEffect(() => {
    const carregarDados = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Carregar perfil do usuário
        const perfilResponse = await fetch('/api/perfil.php');
        if (perfilResponse.ok) {
          const perfilData = await perfilResponse.json();
          setUserProfile(perfilData);
        }

        // Carregar reservas do usuário
        const reservasResponse = await fetch('/api/reserva.php');
        if (reservasResponse.ok) {
          const reservasData = await reservasResponse.json();
          setReservas(reservasData);
        }

        // Carregar cartões do usuário
        const cartoesResponse = await fetch('/api/cartao.php');
        if (cartoesResponse.ok) {
          const cartoesData = await cartoesResponse.json();
          setCartoes(cartoesData);
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar suas informações.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [user, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Próxima reserva / dias
  const getNextReservation = () => {
    const now = new Date();
    const upcoming = reservas
      .filter((reserva) => new Date(reserva.data_entrada) > now && reserva.status === 'Pagamento aprovado')
      .sort((a, b) => new Date(a.data_entrada).getTime() - new Date(b.data_entrada).getTime());
    return upcoming[0];
  };

  const nextReservation = getNextReservation();

  const getDaysUntilNext = () => {
    if (!nextReservation) return null;
    const now = new Date();
    const checkInDate = new Date(nextReservation.data_entrada);
    const diffTime = checkInDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilNext = getDaysUntilNext();

  // Formatações para pagamento
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      let month = v.substring(0, 2);
      let year = v.substring(2, 4);
      if (parseInt(month, 10) > 12) month = '12';
      else if (parseInt(month, 10) === 0 && month.length === 2) month = '01';
      return month + (year ? '/' + year : '');
    }
    return v;
  };

  const formatCVV = (value: string) => value.replace(/\D/g, '').substring(0, 3);

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 11);
    if (v.length === 11) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (v.length >= 9) return v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
    if (v.length >= 6) return v.replace(/(\d{3})(\d{3})/, '$1.$2.');
    if (v.length >= 3) return v.replace(/(\d{3})/, '$1.');
    return v;
  };

  const handlePaymentInputChange = (field: string, value: string) => {
    let formatted = value;
    if (field === 'cardNumber') formatted = formatCardNumber(value);
    else if (field === 'expiryDate') formatted = formatExpiryDate(value);
    else if (field === 'cvv') formatted = formatCVV(value);
    else if (field === 'cpf') formatted = formatCPF(value);

    setPaymentData((p) => ({ ...p, [field]: formatted }));
  };

  // Função para adicionar cartão
  const adicionarCartao = async () => {
    try {
      const response = await fetch('/api/cartao.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero: paymentData.cardNumber.replace(/\s/g, ''),
          titular: paymentData.holderName,
          validade: paymentData.expiryDate,
          cvv: paymentData.cvv
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Cartão adicionado com sucesso!',
          description: 'Seu cartão foi salvo com segurança.',
        });
        // Recarregar lista de cartões
        const cartoesResponse = await fetch('/api/cartao.php');
        if (cartoesResponse.ok) {
          const cartoesData = await cartoesResponse.json();
          setCartoes(cartoesData);
        }
        setPaymentData({ cardNumber: '', expiryDate: '', cvv: '', holderName: '', cpf: '' });
      } else {
        throw new Error(data.erro);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar cartão",
        description: error.message || "Erro ao processar cartão.",
      });
    }
  };

  // Função para criar reserva
  const criarReserva = async (apartamentoId: string, apartamentoNome: string, dataEntrada: string, dataSaida: string, valorTotal: number) => {
    try {
      const response = await fetch('/api/reserva.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartamento_id: apartamentoId,
          apartamento_nome: apartamentoNome,
          data_entrada: dataEntrada,
          data_saida: dataSaida,
          valor_total: valorTotal,
          dados_pessoais: JSON.stringify({
            nome: userProfile?.nome || user?.nome,
            cpf: paymentData.cpf,
            email: userProfile?.email || user?.email,
            telefone: userProfile?.telefone
          }),
          endereco_completo: userProfile?.endereco
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Reserva realizada com sucesso!',
          description: 'Sua reserva foi confirmada.',
        });
        // Recarregar lista de reservas
        const reservasResponse = await fetch('/api/reserva.php');
        if (reservasResponse.ok) {
          const reservasData = await reservasResponse.json();
          setReservas(reservasData);
        }
        return true;
      } else {
        throw new Error(data.erro);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar reserva",
        description: error.message || "Erro ao processar reserva.",
      });
      return false;
    }
  };

  // Handler para pré-reserva
  const handlePreReserva = async () => {
    if (selectedReservation) {
      // Primeiro adiciona o cartão
      await adicionarCartao();
      
      // Depois cria a reserva
      const sucesso = await criarReserva(
        selectedReservation.apartamento_id,
        selectedReservation.apartamento_nome,
        selectedReservation.data_entrada,
        selectedReservation.data_saida,
        selectedReservation.valor_total
      );

      if (sucesso) {
        setSelectedReservation(null);
      }
    }
  };

  // Código do modal de segurança (mantido do original)
  useEffect(() => {
    if (codeModalOpen) {
      setCodeDigits(Array(digitLength).fill(''));
      setTimeout(() => {
        inputRefs.current = inputRefs.current.slice(0, digitLength);
        inputRefs.current[0]?.focus();
      }, 60);
    } else {
      inputRefs.current = [];
    }
  }, [codeModalOpen, digitLength]);

  const handleDigitChange = (val: string, idx: number) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    setCodeDigits(prev => {
      const copy = [...prev];
      copy[idx] = v;
      return copy;
    });

    if (v && idx < digitLength - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (!codeDigits[idx] && idx > 0) {
        setCodeDigits(prev => {
          const copy = [...prev];
          copy[idx - 1] = '';
          return copy;
        });
        inputRefs.current[idx - 1]?.focus();
      } else {
        setCodeDigits(prev => {
          const copy = [...prev];
          copy[idx] = '';
          return copy;
        });
      }
    } else if (/^[0-9]$/.test(e.key)) {
      setTimeout(() => {
        if (idx < digitLength - 1) inputRefs.current[idx + 1]?.focus();
      }, 0);
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < digitLength - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleCheckCode = () => {
    const filled = Array.from({ length: digitLength }).every((_, i) => {
      const d = codeDigits[i];
      return typeof d === 'string' && /^\d$/.test(d);
    });
    if (filled) {
      toast({ title: 'Código aceito', description: `Código de ${digitLength} dígitos validado.` });
      setCodeModalOpen(false);
      setCodeDigits([]);
    } else {
      toast({ title: 'Código inválido', description: `Preencha os ${digitLength} dígitos corretamente.` });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sea-light via-background to-sea-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sea mx-auto mb-4"></div>
          <p className="text-sea-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-light via-background to-sea-light">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sea/20 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-3 py-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-sea-dark">Minha Conta</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo, {user?.nome}!</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="h-9 px-3">
              <LogOut className="mr-1 h-3 w-3" />
              Sair
            </Button>
          </div>

          <nav className="flex gap-1 w-full">
            <Button asChild variant="ghost" className="flex-1 text-sea hover:text-sea-dark hover:bg-sea/10 rounded-lg justify-center min-h-[40px] text-xs">
              <Link to="/"><Home className="mr-1 h-3 w-3" />Início</Link>
            </Button>
            <Button asChild variant="ghost" className="flex-1 text-sea hover:text-sea-dark hover:bg-sea/10 rounded-lg justify-center min-h-[40px] text-xs">
              <Link to="/apartments"><Building2 className="mr-1 h-3 w-3" />Imóveis</Link>
            </Button>
            <Button asChild variant="ghost" className="flex-1 text-sea hover:text-sea-dark hover:bg-sea/10 rounded-lg justify-center min-h-[40px] text-xs">
              <Link to="/contact"><Mail className="mr-1 h-3 w-3" />Contato</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-3 py-4">
        {/* Informações do Usuário */}
        <Card className="glass-card border-sea/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-sea-dark">Meus Dados</CardTitle>
            <CardDescription className="text-sm">Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-sea" />
              <div>
                <p className="font-medium">{userProfile?.nome || user?.nome}</p>
                <p className="text-sm text-muted-foreground">{userProfile?.email || user?.email}</p>
              </div>
            </div>
            {userProfile?.telefone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-sea" />
                <p className="text-sm">{userProfile.telefone}</p>
              </div>
            )}
            {userProfile?.endereco && (
              <div className="flex items-center gap-3">
                <Map className="h-4 w-4 text-sea" />
                <p className="text-sm">{userProfile.endereco}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid gap-4 grid-cols-2 mb-6">
          <Card className="glass-card border-sea/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-sea-dark">Total de Reservas</CardTitle>
              <Calendar className="h-3 w-3 text-sea" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-xl font-bold text-sea-dark">{reservas.length}</div>
              <p className="text-xs text-muted-foreground">reservas realizadas</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-sea/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-sea-dark">Cartões Salvos</CardTitle>
              <CreditCard className="h-3 w-3 text-sea" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-xl font-bold text-sea-dark">{cartoes.length}</div>
              <p className="text-xs text-muted-foreground">cartões cadastrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Reservas Section */}
        <Card className="glass-card border-sea/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-sea-dark">Suas Reservas</CardTitle>
            <CardDescription className="text-sm">Histórico de reservas realizadas</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {reservas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="p-4 border border-sea/20 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-sea-dark">{reserva.apartamento_nome}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reserva.status === 'Pagamento aprovado' 
                          ? 'bg-green-100 text-green-700' 
                          : reserva.status === 'Pagamento em análise' 
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {reserva.status === 'Pagamento aprovado' ? 'Confirmado'
                        : reserva.status === 'Pagamento em análise' ? 'Pendente'
                        : reserva.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-sea" />
                      <span>Check-in: {new Date(reserva.data_entrada).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-sea" />
                      <span>Check-out: {new Date(reserva.data_saida).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Valor: R$ {reserva.valor_total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {/* Detalhes da Reserva */}
                    <Dialog
                      open={detailsReservation?.id === reserva.id}
                      onOpenChange={(open) => {
                        if (!open) setDetailsReservation(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDetailsReservation(reserva)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Reserva</DialogTitle>
                        </DialogHeader>

                        {detailsReservation && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Informações do Imóvel</h4>
                              <p><strong>Nome:</strong> {detailsReservation.apartamento_nome}</p>
                              <p><strong>Check-in:</strong> {new Date(detailsReservation.data_entrada).toLocaleDateString('pt-BR')}</p>
                              <p><strong>Check-out:</strong> {new Date(detailsReservation.data_saida).toLocaleDateString('pt-BR')}</p>
                              <p><strong>Valor Total:</strong> R$ {detailsReservation.valor_total.toFixed(2)}</p>
                              <p><strong>Status:</strong> {detailsReservation.status}</p>
                            </div>

                            {detailsReservation.dados_pessoais && (
                              <div>
                                <h4 className="font-semibold mb-2">Dados Pessoais</h4>
                                {(() => {
                                  try {
                                    const dados = JSON.parse(detailsReservation.dados_pessoais);
                                    return (
                                      <>
                                        <p><strong>Nome:</strong> {dados.nome || '-'}</p>
                                        <p><strong>CPF:</strong> {dados.cpf || '-'}</p>
                                        <p><strong>Email:</strong> {dados.email || '-'}</p>
                                        <p><strong>Telefone:</strong> {dados.telefone || '-'}</p>
                                      </>
                                    );
                                  } catch {
                                    return <p>Dados não disponíveis</p>;
                                  }
                                })()}
                              </div>
                            )}

                            {detailsReservation.endereco_completo && (
                              <div>
                                <h4 className="font-semibold mb-2">Endereço</h4>
                                <p>{detailsReservation.endereco_completo}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Ações de Pagamento */}
                    {reserva.status === 'Pagamento em análise' && (
                      <>
                        <Button variant="outline" size="sm" disabled className="bg-yellow-400 hover:bg-yellow-400 text-black border-yellow-500 cursor-not-allowed">
                          Pagamento em Análise
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {reservas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-sea/30" />
                  <p>Você ainda não possui reservas.</p>
                  <Button asChild className="mt-4 bg-sea hover:bg-sea-dark text-white">
                    <Link to="/apartments">Fazer uma Reserva</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cartões Section */}
        <Card className="glass-card border-sea/20 mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-sea-dark">Meus Cartões</CardTitle>
            <CardDescription className="text-sm">Cartões de crédito salvos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartoes.map((cartao) => (
                <div key={cartao.id} className="p-4 border border-sea/20 rounded-lg bg-white/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">**** **** **** {cartao.numero.slice(-4)}</p>
                      <p className="text-sm text-muted-foreground">{cartao.titular}</p>
                      <p className="text-xs text-muted-foreground">Validade: {cartao.validade}</p>
                    </div>
                    <CreditCard className="h-6 w-6 text-sea" />
                  </div>
                </div>
              ))}

              {cartoes.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-sea/30" />
                  <p>Nenhum cartão cadastrado</p>
                </div>
              )}

              {/* Formulário para adicionar novo cartão */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-sea hover:bg-sea-dark text-white mt-4">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Adicionar Cartão
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="holderName">Nome do Titular</Label>
                      <Input
                        id="holderName"
                        placeholder="Nome completo do titular"
                        value={paymentData.holderName}
                        onChange={(e) => handlePaymentInputChange('holderName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Validade</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Pagamento Seguro</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Seus dados são criptografados e protegidos por certificado SSL.
                      </p>
                    </div>
                    <Button onClick={adicionarCartao} className="w-full">Salvar Cartão</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;