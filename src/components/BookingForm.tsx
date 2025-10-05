
import { useState } from "react";
import { Check, CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useReservations } from "@/contexts/ReservationContext";
import { useParams } from "react-router-dom";
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

export default function BookingForm() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { addReservation } = useReservations();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const apartment = allApartments.find(apt => apt.id === id);

  const calculateNights = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !apartment || !name || !email || !phone) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
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
      guests: parseInt(adults) + parseInt(children),
      totalPrice: totalPrice,
      name,
      email,
      phone
    });
    
    const message = `Olá! Gostaria de solicitar uma reserva para:

${apartment.name}
${apartment.location}
R$ ${dailyRate}/dia

Dados do hóspede:
Nome: ${name}
Email: ${email}
Telefone: ${phone}

Datas solicitadas:
Entrada: ${format(startDate, "dd/MM/yyyy", { locale: ptBR })}
Saída: ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}

Resumo da estadia:
${nights} diárias x R$ ${dailyRate} = R$ ${totalPrice}

Hóspedes: ${adults} adultos${children !== "0" ? `, ${children} crianças` : ""}`;

    const phoneNumber = "5583986667429";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    toast({
      title: "Reserva salva!",
      description: "Sua reserva foi salva em sua conta. Você pode visualizá-la no dashboard.",
    });
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      setStartDate(undefined);
      setEndDate(undefined);
      setAdults("2");
      setChildren("0");
    }, 3000);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="android-card p-6 space-y-6 animate-fade-in [animation-delay:200ms]"
    >
      <h3 className="text-2xl font-bold text-center mb-6">{t.bookingForm.title}</h3>
      
      <div className="space-y-4">
        {/* Dados Pessoais */}
        <div className="space-y-4 border-b border-sea/20 pb-4">
          <h4 className="text-lg font-semibold text-sea-dark">Dados Pessoais</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="android-input border-sea/30 focus:border-sea"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(83) 99999-9999"
                className="android-input border-sea/30 focus:border-sea"
                required
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="email" className="text-base">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="android-input border-sea/30 focus:border-sea"
              required
            />
          </div>
        </div>
        
        {/* Datas da Reserva */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-sea-dark">Datas da Reserva</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-in Date */}
          <div className="space-y-3">
            <label htmlFor="check-in" className="block text-base font-medium">
              {t.bookingForm.checkIn}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="check-in"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal android-input",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : <span>{t.bookingForm.selectDate}</span>}
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
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Check-out Date */}
          <div className="space-y-3">
            <label htmlFor="check-out" className="block text-base font-medium">
              {t.bookingForm.checkOut}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="check-out"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal android-input",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : <span>{t.bookingForm.selectDate}</span>}
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
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        </div>
        
        {/* Hóspedes */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-sea-dark">Hóspedes</h4>
          <div className="space-y-3">
            <label htmlFor="adults" className="block text-base font-medium">
              {t.bookingForm.adults}
            </label>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger id="adults" className="w-full android-input">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? t.bookingForm.adult : "Adultos"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Children - Optional field, collapsed by default */}
          <details className="space-y-2">
            <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground">
              + Adicionar crianças (opcional)
            </summary>
            <Select value={children} onValueChange={setChildren}>
              <SelectTrigger className="w-full android-input">
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
          </details>
        </div>
      </div>
      
      <Button type="submit" className="w-full btn-primary android-touch relative">
        {submitted ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            {t.bookingForm.bookingConfirmed}
          </>
        ) : (
          <>
            <Users className="mr-2 h-4 w-4" />
            {t.bookingForm.checkAvailability}
          </>
        )}
      </Button>
    </form>
  );
}
