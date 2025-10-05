import { useEffect, useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarIcon, Users, CreditCard, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApartmentProps } from "@/components/ApartmentCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Sample apartments data - Vamos usar os mesmos do seu Index.tsx
const apartmentsData: ApartmentProps[] = [
  {
    id: "9",
    name: "Pousada Beach House Coqueirinho",
    description: "Pousada Beach House Coqueirinho fornece acomodação com jardim, estacionamento privativo, terraço e restaurante em Jacumã.",
    price: 100,
    capacity: 4,
    size: 35,
    image: "/lovable-uploads/c1ca8b68-2f3f-4bf0-a240-f707088429c0.png",
    location: "Jacumã",
    features: ["Jardim", "Estacionamento Privativo", "Terraço", "Restaurante", "Bar", "Piscina ao Ar Livre", "Wi-Fi Grátis"]
  },
  {
    id: "8",
    name: "Casa moderna Malvinas Campina Grande",
    description: "Casa moderna Malvinas fica em Campina Grande e oferece jardim, terraço e churrasqueira.",
    price: 200,
    capacity: 10,
    size: 190,
    image: "/lovable-uploads/02722158-e81f-4f0f-9e15-843a68bf7c50.png",
    location: "Campina Grande - Malvinas",
    features: ["Wi-Fi Grátis", "Ar Condicionado", "Estacionamento Privativo", "Jardim", "Terraço", "Churrasqueira"]
  },
  {
    id: "7",
    name: "Get One - Bessa",
    description: "Get One - Bessa está em João Pessoa e conta com acomodação com piscina ao ar livre e lounge compartilhado.",
    price: 100,
    capacity: 2,
    size: 30,
    image: "/lovable-uploads/69e2f672-50dc-4410-a191-8579550bc3e0.png",
    location: "João Pessoa - Bessa",
    features: ["Piscina ao Ar Livre", "Lounge Compartilhado", "Cozinha Equipada", "Geladeira", "Micro-ondas", "Frigobar"]
  },
];

export default function BookingPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 7));
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [selectedApartment, setSelectedApartment] = useState<ApartmentProps | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Brasil",
    paymentMethod: "credit-card",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    specialRequests: ""
  });
  
  useEffect(() => {
    // Verificar se usuário está logado
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Você precisa estar logado para fazer uma reserva.",
      });
      navigate('/login');
      return;
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Preencher dados do usuário se disponível
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.nome?.split(' ')[0] || '',
        lastName: user.nome?.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, navigate, toast, user]);
  
  // Calculate nights and total price
  const nightsCount = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const totalPrice = selectedApartment ? selectedApartment.price * nightsCount : 0;
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry date
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

  // Handle payment input changes with formatting
  const handlePaymentInputChange = (field: string, value: string) => {
    let formatted = value;
    if (field === 'cardNumber') formatted = formatCardNumber(value);
    else if (field === 'cardExpiry') formatted = formatExpiryDate(value);
    else if (field === 'cardCvc') formatted = value.replace(/\D/g, '').substring(0, 3);

    setFormData(prev => ({ ...prev, [field]: formatted }));
  };
  
  // Submit booking to API
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedApartment || !startDate || !endDate) {
        throw new Error("Dados incompletos para a reserva");
      }

      // 1. Se for cartão de crédito, salvar o cartão
      let cartaoSalvo = false;
      if (formData.paymentMethod === "credit-card" && formData.cardNumber && formData.cardName) {
        const cartaoResponse = await fetch('/api/cartao.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            numero: formData.cardNumber.replace(/\s/g, ''),
            titular: formData.cardName,
            validade: formData.cardExpiry,
            cvv: formData.cardCvc
          }),
        });

        if (!cartaoResponse.ok) {
          const errorData = await cartaoResponse.json();
          throw new Error(errorData.erro || 'Erro ao salvar cartão');
        }

        cartaoSalvo = true;
      }

      // 2. Criar a reserva
      const reservaResponse = await fetch('/api/reserva.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartamento_id: selectedApartment.id,
          apartamento_nome: selectedApartment.name,
          data_entrada: startDate.toISOString().split('T')[0],
          data_saida: endDate.toISOString().split('T')[0],
          valor_total: totalPrice,
          dados_pessoais: JSON.stringify({
            nome: `${formData.firstName} ${formData.lastName}`,
            cpf: "", // Pode adicionar campo CPF se necessário
            email: formData.email,
            telefone: formData.phone
          }),
          endereco_completo: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`
        }),
      });

      const reservaData = await reservaResponse.json();

      if (!reservaResponse.ok) {
        throw new Error(reservaData.erro || 'Erro ao criar reserva');
      }

      // Sucesso!
      setIsBookingConfirmed(true);
      
      toast({
        title: "Reserva confirmada!",
        description: "Sua reserva foi realizada com sucesso.",
      });

      // Redirecionar para dashboard após delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error: any) {
      console.error('Erro na reserva:', error);
      toast({
        variant: "destructive",
        title: "Erro na reserva",
        description: error.message || "Erro ao processar sua reserva.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se não está autenticado, mostrar loading
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sea mb-4"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Faça sua Reserva
              </h1>
              <p className="text-muted-foreground text-lg">
                Complete sua reserva em poucos passos simples.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>
        
        {/* Booking Steps */}
        <section className="container py-8">
          <div className="relative animate-fade-in [animation-delay:200ms]">
            <div className="flex justify-between items-center mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                      currentStep >= step
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step === 1 ? "Escolher Acomodação" : step === 2 ? "Dados Pessoais" : "Confirmação"}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted z-0">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Step 1: Choose Room */}
          {currentStep === 1 && (
            <div className="animate-fade-in [animation-delay:300ms]">
              <div className="max-w-4xl mx-auto">
                {/* Date and Guests Selection */}
                <div className="glass-card p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Selecione Datas e Hóspedes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Check-in Date */}
                    <div className="space-y-2">
                      <label htmlFor="check-in" className="block text-sm font-medium">
                        Data de Entrada
                      </label>
                      <Popover>
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
                            {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Check-out Date */}
                    <div className="space-y-2">
                      <label htmlFor="check-out" className="block text-sm font-medium">
                        Data de Saída
                      </label>
                      <Popover>
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
                            {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) => date < (startDate || new Date())}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Adults */}
                    <div className="space-y-2">
                      <label htmlFor="adults" className="block text-sm font-medium">
                        Adultos
                      </label>
                      <Select value={adults} onValueChange={setAdults}>
                        <SelectTrigger id="adults" className="w-full">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Adulto" : "Adultos"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Children */}
                    <div className="space-y-2">
                      <label htmlFor="children" className="block text-sm font-medium">
                        Crianças
                      </label>
                      <Select value={children} onValueChange={setChildren}>
                        <SelectTrigger id="children" className="w-full">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Criança" : "Crianças"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Apartments Selection */}
                <h2 className="text-xl font-semibold mb-4">Selecione sua Acomodação</h2>
                <div className="space-y-6">
                  {apartmentsData.map((apartment) => (
                    <div 
                      key={apartment.id}
                      className={cn(
                        "border rounded-xl overflow-hidden transition-all flex flex-col md:flex-row",
                        selectedApartment?.id === apartment.id 
                          ? "border-primary shadow-md" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img 
                          src={apartment.image} 
                          alt={apartment.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{apartment.name}</h3>
                          <p className="text-muted-foreground mb-4">{apartment.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="text-sm bg-muted px-3 py-1 rounded-full">
                              {apartment.capacity} Hóspedes
                            </div>
                            <div className="text-sm bg-muted px-3 py-1 rounded-full">
                              {apartment.size} m²
                            </div>
                            <div className="text-sm bg-muted px-3 py-1 rounded-full">
                              {apartment.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="text-xl font-bold">R$ {apartment.price}</span>
                            <span className="text-muted-foreground text-sm"> / noite</span>
                          </div>
                          <Button 
                            variant={selectedApartment?.id === apartment.id ? "default" : "outline"}
                            className={selectedApartment?.id === apartment.id ? "btn-primary" : ""}
                            onClick={() => setSelectedApartment(apartment)}
                          >
                            {selectedApartment?.id === apartment.id ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Selecionado
                              </>
                            ) : (
                              "Selecionar"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-8">
                  <Button 
                    className="btn-primary"
                    disabled={!selectedApartment}
                    onClick={() => setCurrentStep(2)}
                  >
                    Continuar <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Guest Details */}
          {currentStep === 2 && (
            <div className="animate-fade-in [animation-delay:300ms]">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Guest Information Form */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
                    <form className="space-y-6">
                      <div className="glass-card p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input 
                              id="firstName" 
                              name="firstName" 
                              value={formData.firstName} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input 
                              id="lastName" 
                              name="lastName" 
                              value={formData.lastName} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={formData.email} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={formData.city} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">CEP</Label>
                            <Input 
                              id="zipCode" 
                              name="zipCode" 
                              value={formData.zipCode} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">País</Label>
                            <Input 
                              id="country" 
                              name="country" 
                              value={formData.country} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="specialRequests">Pedidos Especiais</Label>
                          <textarea 
                            id="specialRequests" 
                            name="specialRequests" 
                            value={formData.specialRequests} 
                            onChange={handleInputChange}
                            className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Algum pedido especial ou observação para sua estadia"
                          />
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-4">Informações de Pagamento</h2>
                      <div className="glass-card p-6 space-y-6">
                        <Tabs defaultValue="credit-card" onValueChange={(value) => handleSelectChange("paymentMethod", value)}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
                            <TabsTrigger value="pay-at-property">Pagar no Local</TabsTrigger>
                          </TabsList>
                          <TabsContent value="credit-card" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardName">Nome no Cartão</Label>
                              <Input 
                                id="cardName" 
                                name="cardName" 
                                value={formData.cardName} 
                                onChange={(e) => handlePaymentInputChange('cardName', e.target.value)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Número do Cartão</Label>
                              <Input 
                                id="cardNumber" 
                                name="cardNumber" 
                                value={formData.cardNumber} 
                                onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                                placeholder="0000 0000 0000 0000" 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Data de Validade</Label>
                                <Input 
                                  id="cardExpiry" 
                                  name="cardExpiry" 
                                  value={formData.cardExpiry} 
                                  onChange={(e) => handlePaymentInputChange('cardExpiry', e.target.value)}
                                  placeholder="MM/AA" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cardCvc">CVV</Label>
                                <Input 
                                  id="cardCvc" 
                                  name="cardCvc" 
                                  value={formData.cardCvc} 
                                  onChange={(e) => handlePaymentInputChange('cardCvc', e.target.value)}
                                  placeholder="123" 
                                />
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="pay-at-property" className="mt-4">
                            <p className="text-muted-foreground">
                              Você precisará fornecer um cartão de crédito válido na chegada para fins de segurança,
                              mas o pagamento será coletado durante sua estadia na propriedade.
                            </p>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </form>
                  </div>
                  
                  {/* Booking Summary */}
                  <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Resumo da Reserva</h2>
                    <div className="glass-card p-6 sticky top-24">
                      {selectedApartment && (
                        <>
                          <div className="pb-4 border-b">
                            <h3 className="font-medium mb-1">{selectedApartment.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedApartment.location}</p>
                          </div>
                          
                          <div className="py-4 border-b space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Check-in</span>
                              <span className="font-medium">
                                {startDate ? format(startDate, "dd/MM/yyyy") : "Não selecionado"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Check-out</span>
                              <span className="font-medium">
                                {endDate ? format(endDate, "dd/MM/yyyy") : "Não selecionado"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Hóspedes</span>
                              <span className="font-medium">
                                {adults} {parseInt(adults) === 1 ? "Adulto" : "Adultos"}
                                {parseInt(children) > 0 && `, ${children} ${parseInt(children) === 1 ? "Criança" : "Crianças"}`}
                              </span>
                            </div>
                          </div>
                          
                          <div className="py-4 border-b space-y-2">
                            <div className="flex justify-between items-center">
                              <span>
                                R$ {selectedApartment.price} x {nightsCount} {nightsCount === 1 ? "noite" : "noites"}
                              </span>
                              <span className="font-medium">R$ {selectedApartment.price * nightsCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Taxa de limpeza</span>
                              <span className="font-medium">R$ 50</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Taxa de serviço</span>
                              <span className="font-medium">R$ 30</span>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <div className="flex justify-between items-center font-bold">
                              <span>Total</span>
                              <span>R$ {totalPrice + 50 + 30}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    className="btn-primary"
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                  >
                    Revisar & Confirmar <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="animate-fade-in [animation-delay:300ms]">
              <div className="max-w-4xl mx-auto">
                {!isBookingConfirmed ? (
                  <>
                    <h2 className="text-xl font-semibold mb-6">Revisar Detalhes da Reserva</h2>
                    
                    <div className="glass-card p-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Apartment Details */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Detalhes da Acomodação</h3>
                          {selectedApartment && (
                            <div className="space-y-4">
                              <div className="rounded-lg overflow-hidden">
                                <img 
                                  src={selectedApartment.image} 
                                  alt={selectedApartment.name}
                                  className="w-full h-48 object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold">{selectedApartment.name}</h4>
                                <p className="text-sm text-muted-foreground">{selectedApartment.location}</p>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Check-in:</span>
                                  <span className="font-medium">
                                    {startDate ? format(startDate, "dd/MM/yyyy") : "Não selecionado"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Check-out:</span>
                                  <span className="font-medium">
                                    {endDate ? format(endDate, "dd/MM/yyyy") : "Não selecionado"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Hóspedes:</span>
                                  <span className="font-medium">
                                    {adults} {parseInt(adults) === 1 ? "Adulto" : "Adultos"}
                                    {parseInt(children) > 0 && `, ${children} ${parseInt(children) === 1 ? "Criança" : "Crianças"}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Guest Details */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Dados do Hóspede</h3>
                          <div className="space-y-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Nome:</span>
                                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="font-medium">{formData.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Telefone:</span>
                                <span className="font-medium">{formData.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Endereço:</span>
                                <span className="font-medium">{formData.address}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cidade:</span>
                                <span className="font-medium">{formData.city}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>País:</span>
                                <span className="font-medium">{formData.country}</span>
                              </div>
                            </div>
                            
                            {formData.specialRequests && (
                              <div>
                                <h4 className="font-medium mb-1">Pedidos Especiais:</h4>
                                <p className="text-sm text-muted-foreground">{formData.specialRequests}</p>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-medium mb-1">Método de Pagamento:</h4>
                              <p className="text-sm">
                                {formData.paymentMethod === "credit-card" ? (
                                  <span className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Cartão de Crédito {formData.cardNumber ? `(terminando em ${formData.cardNumber.slice(-4)})` : ""}
                                  </span>
                                ) : (
                                  "Pagar no Local"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Summary */}
                    <div className="glass-card p-6 mb-8">
                      <h3 className="text-lg font-medium mb-4">Resumo de Preços</h3>
                      <div className="space-y-2">
                        {selectedApartment && (
                          <>
                            <div className="flex justify-between items-center">
                              <span>
                                R$ {selectedApartment.price} x {nightsCount} {nightsCount === 1 ? "noite" : "noites"}
                              </span>
                              <span className="font-medium">R$ {selectedApartment.price * nightsCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Taxa de limpeza</span>
                              <span className="font-medium">R$ 50</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Taxa de serviço</span>
                              <span className="font-medium">R$ 30</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t mt-4">
                              <span className="font-semibold">Total</span>
                              <span className="font-bold text-xl">R$ {totalPrice + 50 + 30}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="mb-8">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 mr-3"
                          required
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          Concordo com os <a href="#" className="text-primary underline">Termos e Condições</a> e <a href="#" className="text-primary underline">Política de Privacidade</a>. Entendo que minha reserva está sujeita à política de cancelamento da propriedade.
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                      >
                        Voltar
                      </Button>
                      <Button 
                        className="btn-primary"
                        onClick={handleSubmitBooking}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processando...
                          </>
                        ) : (
                          <>
                            Confirmar Reserva <Check className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="glass-card p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Reserva Confirmada!</h2>
                    <p className="text-muted-foreground mb-6">
                      Sua reserva foi confirmada com sucesso. Um email de confirmação foi enviado para {formData.email}.
                    </p>
                    <p className="font-medium mb-8">
                      Código da Reserva: <span className="text-primary">GF-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                    </p>
                    <Button asChild className="btn-primary">
                      <Link to="/dashboard">Ir para Minha Conta</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}