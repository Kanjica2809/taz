import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Check, CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useReservations } from "@/contexts/ReservationContext";
import { useToast } from "@/hooks/use-toast";

// Dados dos apartamentos
const allApartments = [
  { id: "12", name: "Apartamento Cabo Branco Beira-Mar", location: "João Pessoa - Cabo Branco", price: 140 },
  { id: "13", name: "Blue Sunset Beira Mar", location: "João Pessoa - Cabo Branco", price: 160 },
  { id: "9", name: "Pousada Beach House Coqueirinho", location: "Jacumã", price: 100 },
  { id: "8", name: "Casa moderna Malvinas Campina Grande", location: "Campina Grande - Malvinas", price: 200 },
  { id: "7", name: "Get One - Bessa", location: "João Pessoa - Bessa", price: 100 },
  { id: "10", name: "Unity Luxo em Cabo Branco", location: "João Pessoa - Cabo Branco", price: 180 },
  { id: "1", name: "Casa no Condomínio Águas da Serra - Locação por Temporada/Diária", location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe", price: 320 },
  { id: "2", name: "Magnífica Casa de Alto Padrão - Águas da Serra", location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe", price: 360 },
  { id: "3", name: "Casa de Alto Padrão - Águas da Serra Haras e Golfe", location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe", price: 320 },
  { id: "4", name: "Luxor Paulo Miranda Home Service - Cabo Branco", location: "João Pessoa - Cabo Branco", price: 200 },
  { id: "5", name: "Edifício Camaratuba - Intermares Frente à Praia", location: "Intermares - Frente à Praia", price: 150 },
  { id: "6", name: "Luxor Cabo Branco Home Service", location: "João Pessoa - Cabo Branco", price: 200 },
];

export default function ContractForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addReservation } = useReservations();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const apartment = allApartments.find(apt => apt.id === id);

  const calculateNights = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 11); // Limita a 11 dígitos
    if (v.length === 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (v.length >= 9) {
      return v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
    } else if (v.length >= 6) {
      return v.replace(/(\d{3})(\d{3})/, '$1.$2.');
    } else if (v.length >= 3) {
      return v.replace(/(\d{3})/, '$1.');
    }
    return v;
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !apartment || !fullName || !cpf || !email || !whatsapp || !address || !number || !zipCode) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    const nights = calculateNights();
    const dailyRate = apartment.price;
    const totalPrice = nights * dailyRate;
    
    // Salvar a reserva no contexto
    addReservation({
      apartment: apartment.name,
      checkIn: startDate.toISOString(),
      checkOut: endDate.toISOString(),
      guests: 2, // Default para reserva
      totalPrice: totalPrice,
      name: fullName,
      email: email,
      phone: whatsapp,
      cpf: cpf,
      address: address,
      number: number,
      zipCode: zipCode,
      isContract: true
    });
    
    toast({
      title: "Reserva salva!",
      description: "Sua solicitação de reserva foi salva em suas reservas.",
    });
    
    setSubmitted(true);
    
    // Redirecionar para o dashboard após 2 segundos
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (!apartment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
            <p className="text-muted-foreground mb-6">O imóvel que você está procurando não existe.</p>
            <Button asChild>
              <Link to="/apartments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Imóveis
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <section className="py-16 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background">
          <div className="container max-w-2xl">
            <div className="flex items-center mb-6">
              <Button asChild variant="ghost" size="sm">
                <Link to={`/apartments/${id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Imóvel
                </Link>
              </Button>
            </div>

            <div className="glass-card p-8 space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Solicitação de Reserva</h1>
                <p className="text-muted-foreground">{apartment.name}</p>
                <p className="text-sm text-muted-foreground">{apartment.location} - R$ {apartment.price}/noite</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Período da Estadia */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Período da Estadia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Check-in Date */}
                    <div className="space-y-2">
                      <Label htmlFor="check-in">Data de Entrada</Label>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-in"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              setStartDateOpen(false); // Fechar calendário automaticamente
                              // Se a data de saída já foi selecionada e é igual ou anterior à nova data de entrada, resetar a data de saída
                              if (endDate && date && endDate <= date) {
                                setEndDate(undefined);
                              }
                            }}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className={cn("p-3 pointer-events-auto")}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Check-out Date */}
                    <div className="space-y-2">
                      <Label htmlFor="check-out">Data de Saída</Label>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="check-out"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              setEndDateOpen(false); // Fechar calendário automaticamente
                            }}
                            initialFocus
                            disabled={(date) => {
                              if (!startDate) return date < new Date();
                              // Não permitir datas iguais ou anteriores à data de entrada
                              const minDate = new Date(startDate);
                              minDate.setDate(minDate.getDate() + 1);
                              return date < minDate;
                            }}
                            className={cn("p-3 pointer-events-auto")}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm">
                        <strong>Resumo:</strong> {calculateNights()} diárias × R$ {apartment.price} = <strong>R$ {calculateNights() * apartment.price}</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Input
                        id="whatsapp"
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço Completo</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Rua *</Label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nome da rua"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Número *</Label>
                      <Input
                        id="number"
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(formatZipCode(e.target.value))}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                      className="max-w-xs"
                    />
                  </div>
                </div>


                <Button type="submit" className="w-full btn-primary relative" size="lg">
                  {submitted ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Solicitação Enviada!
                    </>
                  ) : (
                    <>
                      Enviar Solicitação de Reserva
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Campos obrigatórios. Suas informações serão salvas em minhas reservas para elaboração da reserva.
                </p>
                
                {submitted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center space-y-3">
                    <p className="text-sm text-green-800 font-medium">
                      Solicitação enviada com sucesso! Acesse suas reservas para acompanhar o status.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}