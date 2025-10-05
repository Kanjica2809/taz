
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApartmentCard, { ApartmentProps } from "@/components/ApartmentCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";

// Imóveis disponíveis para aluguel na Paraíba
const allApartments: ApartmentProps[] = [
  // ...existing apartments...

  {
    id: "9",
    name: "Pousada Beach House Coqueirinho",
    description: "Pousada Beach House Coqueirinho fornece acomodação com jardim, estacionamento privativo, terraço e restaurante em Jacumã. Praia Encantada fica a poucos passos de distância. Com bar, a acomodação está localizada a cerca de 29 km de Cabo Branco Lighthouse. A pousada conta com piscina ao ar livre e um balcão de turismo e Wi-Fi grátis em toda a propriedade. Em Pousada Beach House Coqueirinho, você pode tomar um café da manhã em estilo buffet. Pousada Beach House Coqueirinho fica a 36 km de Rodoviária de João Pessoa e a 36 km de Estação de Trem. O Aeroporto Internacional Presidente Castro Pinto - João Pessoa fica a 40 km de distância, e a acomodação oferece um serviço de transfer (aeroporto) a um custo adicional.",
    price: 100,
    capacity: 4,
    size: 35,
    image: "/lovable-uploads/c1ca8b68-2f3f-4bf0-a240-f707088429c0.png",
    location: "Jacumã",
    features: ["Jardim", "Estacionamento Privativo", "Terraço", "Restaurante", "Bar", "Piscina ao Ar Livre", "Wi-Fi Grátis", "Café da Manhã Buffet", "Transfer Aeroporto", "Poucos Passos da Praia", "Balcão de Turismo"]
  },
  {
    id: "8",
    name: "Casa moderna Malvinas Campina Grande",
    description: "Casa moderna Malvinas fica em Campina Grande e oferece jardim, terraço e churrasqueira. Você contará com Wi-Fi grátis e estacionamento privativo disponível no local nesta acomodação com ar-condicionado. Estádio Amigão fica a 6,9 km de distância. Com PS3, o apartamento conta com cozinha com geladeira, forno e micro-ondas, sala de estar com área de estar e espaço para refeições, além de 3 quartos e 4 banheiros com banheira de hidromassagem e banheira. O apartamento oferece toalhas e roupa de cama. Em Casa moderna Malvinas, você pode aproveitar uma banheira de hidromassagem. Casa moderna Malvinas oferece serviço de aluguel de bicicleta. O Aeroporto de Campina Grande fica a 5 km de distância, e a acomodação oferece um serviço de transfer (aeroporto) a um custo adicional.",
    price: 200,
    capacity: 10,
    size: 190,
    image: "/lovable-uploads/02722158-e81f-4f0f-9e15-843a68bf7c50.png",
    location: "Campina Grande - Malvinas",
    features: ["Wi-Fi Grátis", "Ar Condicionado", "Estacionamento Privativo", "Jardim", "Terraço", "Churrasqueira", "PS3", "Banheira de Hidromassagem", "3 Quartos", "4 Banheiros", "Transfer Aeroporto", "Aluguel de Bicicleta"],
    images: [
      "/lovable-uploads/ef112ae9-043c-4e90-a0c6-d4d4b3f85c0e.png",
      "/lovable-uploads/0235d88e-17d0-4db7-bcb4-513bdd483e47.png",
      "/lovable-uploads/751ad7d4-92c4-499b-b0f7-2a9217b76606.png",
      "/lovable-uploads/afe6e16d-44cd-4308-937b-8d843a8c5d3b.png",
      "/lovable-uploads/aeb0bccd-e783-4ccb-bbd1-a5a58bc8e50d.png",
      "/lovable-uploads/05fbc98b-94b3-4c7a-bdfc-ac9708bc74ed.png",
      "/lovable-uploads/48f120a9-3753-4bfc-be60-2549de35d1e2.png",
      "/lovable-uploads/7b7378b4-cf67-48e0-9197-8265f34139be.png",
      "/lovable-uploads/feaf645b-1bbb-4354-8cef-2ec00fd1fe3c.png"
    ]
  },
  {
    id: "7",
    name: "Get One - Bessa",
    description: "Get One - Bessa está em João Pessoa e conta com acomodação com piscina ao ar livre e lounge compartilhado. Algumas unidades também possuem uma cozinha equipada com geladeira, micro-ondas e frigobar. Get One - Bessa fica a poucos passos de Praia do Bessa e a 8,8 km de Estação de Trem. O Aeroporto Internacional Presidente Castro Pinto fica a 18 km da acomodação. Ideal para casais em busca de conforto e proximidade com a praia.",
    price: 100,
    capacity: 2,
    size: 30,
    image: "/lovable-uploads/69e2f672-50dc-4410-a191-8579550bc3e0.png",
    location: "João Pessoa - Bessa",
    features: ["Piscina ao Ar Livre", "Lounge Compartilhado", "Cozinha Equipada", "Geladeira", "Micro-ondas", "Frigobar", "Wi-Fi Grátis", "Vista para o Mar", "Poucos Passos da Praia"],
    images: [
      "/lovable-uploads/c3cc72bc-3115-42a6-8a22-f9706436cc6a.png",
      "/lovable-uploads/71efdffe-ca5c-4133-aee5-5f908104b4c3.png",
      "/lovable-uploads/a2f82c85-d845-476e-a488-1b8ac8bcf00d.png",
      "/lovable-uploads/441a6e41-85c8-4d48-89ce-d7f78c0dc827.png",
      "/lovable-uploads/8a9c1102-196e-4c1c-a59f-ca2486dd7acb.png",
      "/lovable-uploads/b0055593-cb2f-409a-a6e2-9fd782e1769f.png",
      "/lovable-uploads/689a34ed-7c03-44ea-a442-eff75f1e627f.png",
      "/lovable-uploads/94da1612-32ef-4884-ad31-ba752ced19ad.png"
    ]
  },
  {
    id: "10",
  name: "Unity Luxo em Cabo Branco",
  description: "Apartamento de luxo Unity localizado em Cabo Branco, oferecendo uma experiência premium com vista para o mar. Unidade moderna e sofisticada, equipada com todas as comodidades necessárias para uma estadia confortável e elegante. Localização privilegiada em Cabo Branco, próxima às principais atrações de João Pessoa.",
    price: 180,
    capacity: 4,
    size: 65,
    image: "/lovable-uploads/6a3b7fe2-1138-4672-986f-f76b0f1d4154.png",
  location: "João Pessoa - Cabo Branco",
    features: ["Vista para o Mar", "Apartamento de Luxo", "Localização Premium", "Moderno e Sofisticado", "Totalmente Equipado", "Próximo às Atrações", "Wi-Fi Grátis", "Ar Condicionado", "Carpediem"],
    images: [
      "/lovable-uploads/477467618.jpg",
      "/lovable-uploads/477467620.jpg",
      "/lovable-uploads/477467637.jpg",
      "/lovable-uploads/477467655.jpg",
      "/lovable-uploads/477467678.jpg",
      "/lovable-uploads/477467741.jpg",
      "/lovable-uploads/477467751.jpg",
      "/lovable-uploads/477467755.jpg",
      "/lovable-uploads/477467780.jpg",
      "/lovable-uploads/477467799.jpg"
    ]
  },
  {
    id: "4",
    name: "Luxor Paulo Miranda Home Service - Cabo Branco",
    description: "O Luxor Paulo Miranda Home Service oferece piscina ao ar livre e vista para o mar em João Pessoa, a 14 km de Jacumã e 20 km de Cabedelo. WiFi gratuito em todos os ambientes. Unidades com área de estar/jantar e cozinha com forno. Dispõe de spa, academia, bilhar, aluguel de carros e bicicletas. Atividades como mergulho com snorkel e windsurf. Estacionamento privativo gratuito.",
    price: 200,
    capacity: 8,
    size: 45,
    image: "/lovable-uploads/328eb1c7-6522-489a-9d36-814da513ddb6.png",
    location: "João Pessoa - Cabo Branco",
    features: ["WiFi Gratuito", "Piscina ao Ar Livre", "Vista para o Mar", "Spa", "Academia", "Bilhar", "Cozinha com Forno", "Estacionamento Privativo", "Aluguel de Carros", "Mergulho/Windsurf"]
  },
  {
    id: "5",
    name: "Edifício Camaratuba - Intermares Frente à Praia",
    description: "O Edifício Camaratuba, localizado em Intermares, oferece experiência confortável a passos da praia. Apartamento com dois quartos, ambiente acolhedor e funcional, cozinha equipada com geladeira, máquina de lavar e utensílios essenciais. Chuveiro com água quente, área de lazer completa com piscina refrescante e área de festa. Localização privilegiada em frente à praia, ideal para atividades ao ar livre.",
    price: 150,
    capacity: 6,
    size: 55,
    image: "/lovable-uploads/6e7c185e-67f7-4459-b02f-3f3321f6893f.png",
    location: "Intermares - Frente à Praia",
    features: ["2 Quartos", "Cozinha Equipada", "Água Quente", "Piscina", "Área de Festa", "Frente à Praia", "Máquina de Lavar", "Área de Lazer", "À Beira-Mar", "Geladeira"]
  },
  {
    id: "6",
    name: "Luxor Cabo Branco Home Service",
    description: "Situado a 70 metros da Praia de Cabo Branco e a 2,7 km de Tambaú, o Luxor Cabo Branco Home Service oferece quartos com ar-condicionado e banheiro privativo em João Pessoa. Esta propriedade à beira-mar oferece acesso a uma varanda, mesa de bilhar, estacionamento privativo gratuito e WiFi gratuito. O apartamento oferece vista do jardim, parquinho infantil e recepção 24 horas.",
    price: 200,
    capacity: 6,
    size: 49,
    image: "/lovable-uploads/ca37793c-78c3-4b9d-95bf-f91affd3c3fd.png",
    location: "João Pessoa - Cabo Branco",
    features: ["WiFi Gratuito", "Ar Condicionado", "Estacionamento Privativo", "Vista do Jardim", "Parquinho Infantil", "Recepção 24h", "Mesa de Bilhar", "70m da Praia", "Varanda", "Banheiro Privativo"]
  },
  {
    id: "1",
    name: "Casa no Condomínio Águas da Serra - Locação por Temporada/Diária",
    description: "Casa completa com 4 quartos suítes, todos com ventilador, área gourmet e localização privilegiada em frente à piscina do condomínio. O condomínio oferece infraestrutura incrível: campos de golfe e beach tênis, segurança 24h, salão de festas à beira do lago, lagos com pedalinhos, charretes, trilhas ecológicas, água mineral própria, engenho com caldo de cana, heliponto, academia, capela, pesca esportiva e parquinho kids.",
    price: 320,
    capacity: 8,
    size: 180,
    image: "/lovable-uploads/cf724afd-acea-4be3-b084-5fcff2e519e8.png",
    location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe",
    features: ["4 Quartos Suítes", "Área Gourmet", "Em frente à Piscina", "Campo de Golfe", "Beach Tênis", "Segurança 24h", "Lagos com Pedalinhos", "Trilhas Ecológicas", "Academia", "Heliponto"]
  },
  {
    id: "2",
    name: "Magnífica Casa de Alto Padrão - Águas da Serra",
    description: "Casa de alto padrão para locação por temporada em condomínio exclusivo. Acomoda até 12 pessoas com 4 suítes climatizadas, piscina de 20m com área infantil, espaço gourmet com churrasqueira, sala de jogos com sinuca, 3 vagas cobertas. Localizada em um dos melhores condomínios de Bananeiras com segurança 24h, próxima ao Bananeiras Parque. Diarista inclusa, aceita pets.",
    price: 360,
    capacity: 12,
    size: 200,
    image: "/lovable-uploads/5c5822eb-6a4c-4e17-9d83-fc7228499caa.png",
    location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe",
    features: ["4 Suítes Climatizadas", "Piscina 20m", "Espaço Gourmet", "Sala de Jogos", "3 Vagas Cobertas", "Segurança 24h", "Diarista Inclusa", "Aceita Pets", "Próximo Bananeiras Parque", "Quarto de Serviço"]
  },
  {
    id: "3",
    name: "Casa de Alto Padrão - Águas da Serra Haras e Golfe",
    description: "Casa de alto padrão para locação por temporada em Bananeiras. Acomoda até 12 pessoas com 4 suítes climatizadas (1 master + 3 suítes), piscina aquecida com WC exclusivo, área gourmet com churrasqueira, sala de jogos com sinuca, 3 vagas de estacionamento. Cozinha equipada com geladeira, airfryer, purificador de água, micro-ondas, freezer e cervejeira. Diarista inclusa, aceita pets.",
    price: 320,
    capacity: 12,
    size: 180,
    image: "/lovable-uploads/77040079-ddd7-4782-95e4-d6cc06b2fc19.png",
    location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe",
    features: ["4 Suítes Climatizadas", "Piscina Aquecida", "Área Gourmet", "Sala de Jogos", "3 Vagas", "Cozinha Equipada", "Diarista Inclusa", "Aceita Pets", "WC Exclusivo Piscina", "Quarto de Serviço"]
  },
  {
    id: "12",
  name: "Apartamento Cabo Branco Beira-Mar",
  description: "Apartamento beira-mar no bairro Cabo Branco, com vista privilegiada para o mar, 1 suíte, sala integrada e cozinha equipada. Prédio com piscina, academia e área de lazer completa. Localização nobre, próximo aos melhores restaurantes e atrações da cidade.",
    price: 140,
    capacity: 2,
    size: 35,
  image: "/lovable-uploads/21387449.jpg",
    location: "João Pessoa - Manaíra",
    features: ["1 Suíte", "Piscina do Prédio", "Academia", "Próximo ao Shopping", "Cozinha Equipada", "Área de Lazer", "Localização Nobre", "Wi-Fi Grátis", "Ar Condicionado"]
  },
  {
    id: "13",
  name: "Blue Sunset Beira Mar",
  description: "Cada detalhe do Blue Sunset Beira Mar foi pensado para proporcionar uma estadia única e confortável. A unidade conta com varanda com vista para o mar, TV de tela plana a cabo, área de estar, cozinha compacta bem equipada, além de um banheiro privativo com chuveiro, produtos de banho de cortesia e secador de cabelo.",
    price: 160,
    capacity: 6,
    size: 80,
  image: "/lovable-uploads/722876543.jpg",
    location: "Serra da Borborema - Bananeiras",
    features: ["Lareira", "Varanda com Rede", "Trilhas Ecológicas", "Construção Sustentável", "Ar Puro", "Temperatura Amena", "Contato com Natureza", "Madeira de Reflorestamento", "Vista da Serra"]
  }
];

export default function Apartments() {
  const { t } = useLanguage();
  const [filteredApartments, setFilteredApartments] = useState<ApartmentProps[]>(allApartments);
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([100, 500]);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = allApartments;
    
    // Filter by capacity
    if (capacityFilter !== "all") {
      const capacity = parseInt(capacityFilter);
      result = result.filter(apt => apt.capacity >= capacity);
    }
    
    // Filter by location
    if (locationFilter !== "all") {
      result = result.filter(apt => apt.location === locationFilter);
    }
    
    // Filter by price range
    result = result.filter(apt => apt.price >= priceRange[0] && apt.price <= priceRange[1]);
    
    setFilteredApartments(result);
  }, [capacityFilter, locationFilter, priceRange]);
  
  // Get unique locations for filter
  const locations = ["all", ...new Set(allApartments.map(apt => apt.location))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Header Section */}
        <section className="relative py-20 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t.apartments.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {t.apartments.subtitle}
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10">
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute top-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>
        
        {/* Filter Section - Android Optimized */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apartments.filters.guests}
                </label>
                <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                  <SelectTrigger className="w-full android-input">
                    <SelectValue placeholder={t.apartments.filters.guests} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.apartments.filters.anyGuests}</SelectItem>
                    <SelectItem value="1">{t.apartments.filters.onePlus}</SelectItem>
                    <SelectItem value="2">{t.apartments.filters.twoPlus}</SelectItem>
                    <SelectItem value="3">{t.apartments.filters.threePlus}</SelectItem>
                    <SelectItem value="4">{t.apartments.filters.fourPlus}</SelectItem>
                    <SelectItem value="8">8+ hóspedes</SelectItem>
                    <SelectItem value="10">10+ hóspedes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apartments.filters.location}
                </label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full android-input">
                    <SelectValue placeholder={t.apartments.filters.location} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.apartments.filters.allLocations}</SelectItem>
                    {locations.filter(loc => loc !== "all").map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apartments.filters.priceRange}: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  defaultValue={[100, 500]}
                  min={100}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 animate-fade-in [animation-delay:200ms]">
              <p className="text-muted-foreground">
                {t.apartments.filters.showing} {filteredApartments.length} {t.apartments.filters.of} {allApartments.length} {t.apartments.filters.accommodations}
              </p>
              <Button 
                variant="outline" 
                className="android-touch"
                onClick={() => {
                  setCapacityFilter("all");
                  setLocationFilter("all");
                  setPriceRange([100, 500]);
                }}
              >
                {t.apartments.filters.resetFilters}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Apartments Grid */}
        <section className="section">
          <div className="container">
            {filteredApartments.length > 0 ? (
              <div className="mobile-grid">
                {filteredApartments.map((apartment, index) => (
                  <div key={apartment.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                    <ApartmentCard apartment={apartment} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">{t.apartments.filters.noMatch}</h3>
                <p className="text-muted-foreground mb-6">{t.apartments.filters.adjustFilters}</p>
                <Button 
                  variant="outline" 
                  className="android-touch"
                  onClick={() => {
                    setCapacityFilter("all");
                    setLocationFilter("all");
                    setPriceRange([100, 500]);
                  }}
                >
                  {t.apartments.filters.resetFilters}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
