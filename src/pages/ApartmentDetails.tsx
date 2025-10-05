import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Maximize, MapPin, Wifi, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApartmentProps } from "@/components/ApartmentCard";

// Todos os imóveis disponíveis
const allApartments: ApartmentProps[] = [
  {
    id: "12",
    name: "Apartamento Cabo Branco Beira-Mar",
  description: "Com varanda e vista privilegiada para a cidade, o flat conta com 1 quarto climatizado, sala de estar aconchegante com TV de tela plana a cabo, cozinha equipada e banheiro moderno com chuveiro. O flat oferece toalhas e roupa de cama.\nO Flat Moderno – Manaíra está localizado a poucos metros da orla de Manaíra e próximo a restaurantes e shoppings. O Aeroporto Internacional Presidente Castro Pinto fica a 22 km de distância.",
    price: 140,
      capacity: 7,
      size: 58,
  image: "/lovable-uploads/21387449.jpg",
      location: "João Pessoa - Cabo Branco",
    features: ["1 Suíte", "Piscina do Prédio", "Academia", "Próximo ao Shopping", "Cozinha Equipada", "Área de Lazer", "Localização Nobre", "Wi-Fi Grátis", "Ar Condicionado"],
    images: [
      "/lovable-uploads/21387460.jpg",
      "/lovable-uploads/21387463.jpg",
      "/lovable-uploads/22215735.jpg",
      "/lovable-uploads/22215758.jpg",
      "/lovable-uploads/138486371.jpg",
      "/lovable-uploads/138486748.jpg",
      "/lovable-uploads/140419278.jpg",
      "/lovable-uploads/165527845.jpg",
      "/lovable-uploads/165528122.jpg"
    ],
  },
  {
    id: "13",
      name: "Blue Sunset Beira Mar",
      description: "Cada detalhe do Blue Sunset Beira Mar foi pensado para proporcionar uma estadia única e confortável. A unidade conta com varanda com vista para o mar, TV de tela plana a cabo, área de estar, cozinha compacta bem equipada, além de um banheiro privativo com chuveiro, produtos de banho de cortesia e secador de cabelo.",
      price: 160,
      capacity: 6,
      size: 56,
      image: "/lovable-uploads/722876543.jpg",
      location: "João Pessoa - Cabo Branco",
      features: [
        "Varanda com Vista para o Mar",
        "Contato com a Natureza",
        "Cozinha Compacta Equipada",
        "Ar Puro e Brisa do Mar",
        "Temperatura Agradável",
        "Banheiro Privativo",
        "Área de Estar Confortável",
        "Construção Sustentável",
        "Produtos de Banho de Cortesia"
      ],
      images: [
        "/lovable-uploads/568527638.jpg",
        "/lovable-uploads/568590780.jpg",
        "/lovable-uploads/568590984.jpg",
        "/lovable-uploads/568591097.jpg",
        "/lovable-uploads/568591261.jpg",
        "/lovable-uploads/568591418.jpg",
        "/lovable-uploads/568591866.jpg",
        "/lovable-uploads/568591885.jpg"
      ],
  },
  {
    id: "9",
    name: "Pousada Beach House Coqueirinho",
    description: "Pousada Beach House Coqueirinho fornece acomodação com jardim, estacionamento privativo, terraço e restaurante em Jacumã. Praia Encantada fica a poucos passos de distância. Com bar, a acomodação está localizada a cerca de 29 km de Cabo Branco Lighthouse. A pousada conta com piscina ao ar livre e um balcão de turismo e Wi-Fi grátis em toda a propriedade. Em Pousada Beach House Coqueirinho, você pode tomar um café da manhã em estilo buffet. Pousada Beach House Coqueirinho fica a 36 km de Rodoviária de João Pessoa e a 36 km de Estação de Trem. O Aeroporto Internacional Presidente Castro Pinto - João Pessoa fica a 40 km de distância, e a acomodação oferece um serviço de transfer (aeroporto) a um custo adicional.",
    price: 100,
    capacity: 4,
    size: 35,
    image: "/lovable-uploads/c1ca8b68-2f3f-4bf0-a240-f707088429c0.png",
    images: [
      "/lovable-uploads/b3436457-c23d-4c3e-9db2-4254560c2e2d.png", // Suíte com banheira
      "/lovable-uploads/7632e09d-dc21-4197-bc4c-2cf9a7f10001.png", // Piscina com vista para o mar
      "/lovable-uploads/a0f2ae71-fb68-41d4-938f-4dfb8d6b9f26.png", // Quarto principal
      "/lovable-uploads/65449e74-ccb0-4927-863e-54785b2b3fcc.png", // Área externa com piscina
      "/lovable-uploads/219cfbc2-72bf-440d-8cbd-4764438a6d97.png", // Banheiro completo
      "/lovable-uploads/08d83a75-95e0-4ec6-ab15-ab96df929c6b.png", // Área de lazer
    ],
    location: "Jacumã",
    features: ["Jardim", "Estacionamento Privativo", "Terraço", "Restaurante", "Bar", "Piscina ao Ar Livre", "Wi-Fi Grátis", "Café da Manhã Buffet", "Transfer Aeroporto", "Poucos Passos da Praia", "Balcão de Turismo"]
  },
  {
    id: "7",
    name: "Get One - Bessa",
    description: "Get One - Bessa está em João Pessoa e conta com acomodação com piscina ao ar livre e lounge compartilhado. Algumas unidades também possuem uma cozinha equipada com geladeira, micro-ondas e frigobar. Get One - Bessa fica a poucos passos de Praia do Bessa e a 8,8 km de Estação de Trem. O Aeroporto Internacional Presidente Castro Pinto fica a 18 km da acomodação. A propriedade oferece vista deslumbrante para o mar, ambiente relaxante e todas as comodidades necessárias para uma estadia confortável. Ideal para casais em busca de tranquilidade e proximidade com uma das praias mais bonitas de João Pessoa.",
    price: 100,
    capacity: 2,
    size: 30,
    image: "/lovable-uploads/69e2f672-50dc-4410-a191-8579550bc3e0.png",
    location: "João Pessoa - Bessa",
    features: ["Piscina ao Ar Livre", "Lounge Compartilhado", "Cozinha Equipada", "Geladeira", "Micro-ondas", "Frigobar", "Wi-Fi Grátis", "Vista para o Mar", "Poucos Passos da Praia", "Ideal para Casais", "Ambiente Relaxante", "Transfer Aeroporto"],
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
  description: "Apartamento de luxo Unity localizado em Cabo Branco, oferecendo uma experiência premium com vista para o mar. Unidade moderna e sofisticada, equipada com todas as comodidades necessárias para uma estadia confortável e elegante. Localização privilegiada próxima às principais atrações de João Pessoa.",
    price: 180,
    capacity: 4,
  size: 35,
  image: "/lovable-uploads/477467618.jpg",
    images: [
      "/lovable-uploads/477467620.jpg",
      "/lovable-uploads/477467655.jpg",
      "/lovable-uploads/477467780.jpg",
      "/lovable-uploads/477467799.jpg",
      "/lovable-uploads/477467637.jpg",
      "/lovable-uploads/477467678.jpg",
      "/lovable-uploads/477467741.jpg",
      "/lovable-uploads/477467751.jpg",
      "/lovable-uploads/477467755.jpg"
    ],
    location: "João Pessoa - Cabo Branco",
    features: ["Vista para o Mar", "Apartamento de Luxo", "Localização Premium", "Moderno e Sofisticado", "Totalmente Equipado", "Próximo às Atrações", "Wi-Fi Grátis", "Ar Condicionado", "Carpediem"]
  },
  {
    id: "1",
    name: "Casa Luxo em Bananeiras no Condomínio Águas da Serra",
    description: "Casa de luxo para locação por temporada no prestigioso Condomínio Águas da Serra. Esta magnífica propriedade oferece o máximo em conforto e elegância, com ambientes sofisticados e acabamentos de alto padrão. Ideal para famílias e grupos que buscam uma experiência exclusiva em Bananeiras, com acesso a todas as comodidades do condomínio e proximidade com as principais atrações da região.",
    price: 400,
    capacity: 10,
    size: 250,
    image: "/lovable-uploads/bf6e8c91-bab6-4851-a1d9-5c88a90d73a2.png",
    images: [
      "/lovable-uploads/b913d7cd-46d3-4905-9b6b-de5c705b308d.png", // Cozinha moderna com bancada
      "/lovable-uploads/fe1f8582-dc29-4c6c-8d49-017bbd0bb4da.png", // Área externa com varanda e piscina
      "/lovable-uploads/b2ba64ac-20f0-4cd3-a493-decea82074b9.png", // Área gourmet com mesa de jantar
      "/lovable-uploads/028c143c-20e5-4640-a279-6431d32bf982.png", // Varanda com mesa e vista
      "/lovable-uploads/0a19309f-3b43-432b-a6c9-c2bf33f627ab.png", // Quarto com cama de casal
      "/lovable-uploads/bad47f71-6d6c-4607-9dd9-f07e2a1cbd0c.png", // Outro quarto com cama de casal
      "/lovable-uploads/8403a09b-8f36-49f4-924b-36bc92fdd3b4.png", // Quarto com duas camas de solteiro
    ],
    location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe",
    features: ["Cozinha Moderna", "Área Gourmet", "Varanda com Vista", "Quartos Luxuosos", "Área Externa", "Piscina do Condomínio", "Segurança 24h", "Campo de Golfe", "Trilhas Ecológicas", "Academia"]
  },
  {
    id: "2",
    name: "Magnífica Casa de Alto Padrão - Águas da Serra",
    description: "Casa de alto padrão para locação por temporada em condomínio exclusivo. Acomoda até 12 pessoas com 4 suítes climatizadas, piscina de 20m com área infantil, espaço gourmet com churrasqueira, sala de jogos com sinuca, 3 vagas cobertas. Localizada em um dos melhores condomínios de Bananeiras com segurança 24h, próxima ao Bananeiras Parque. Diarista inclusa, aceita pets.",
    price: 360,
    capacity: 12,
    size: 200,
    image: "/lovable-uploads/5c5822eb-6a4c-4e17-9d83-fc7228499caa.png",
    images: [
      "/lovable-uploads/c4f2932a-045d-4987-a04e-124d0d7dd071.png", // Sala moderna
      "/lovable-uploads/eb968d8f-7c4a-4cb9-9976-b591384924da.png", // Quarto com duas camas
      "/lovable-uploads/735f6f7b-ad3e-4a5e-98cd-9f816edbe4b6.png", // Sala de estar elegante
      "/lovable-uploads/014b907c-3cd4-44b3-92dc-bedb8c88898f.png", // Área externa com piscina
      "/lovable-uploads/65fc5095-c47d-4168-a2bd-9138c515a90d.png", // Quarto casal
      "/lovable-uploads/4c644980-749c-40d0-b9bb-fac56d90296f.png", // Outro quarto
      "/lovable-uploads/0c8e9ad5-7a0e-4bd3-8089-68c608f013cc.png", // Quarto com duas camas
      "/lovable-uploads/e826d3e1-d977-4dd8-b183-f8982be8632f.png", // Sala de estar
      "/lovable-uploads/c58be99c-ad77-4651-b888-b0da89226e13.png", // Área de jogos com mesa de sinuca
    ],
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
    image: "/lovable-uploads/ad5d5315-a8ef-4736-b3bb-c23dc3182bef.png",
    images: [
      "/lovable-uploads/e6617c8b-5592-4ed5-a1b2-95dd698d8794.png",
      "/lovable-uploads/bcfee396-2341-49a2-bfa0-9e731582d873.png",
      "/lovable-uploads/e594e0ae-4df9-43c4-964c-15f554079e90.png",
      "/lovable-uploads/20a0d06e-6f92-4dff-8fbe-f648ff75327e.png",
      "/lovable-uploads/db68e40b-3840-4b51-9c25-4e42ec479c06.png",
      "/lovable-uploads/d743523c-b063-42d0-83b3-de9a6950c624.png",
      "/lovable-uploads/545828f0-cbc4-4217-8a11-1df71ec75096.png",
      "/lovable-uploads/d47ab50b-8a19-4831-a36a-c10d520c603b.png"
    ],
    location: "Bananeiras - Condomínio Águas da Serra Haras e Golfe",
    features: ["4 Suítes Climatizadas", "Piscina Aquecida", "Área Gourmet", "Sala de Jogos", "3 Vagas", "Cozinha Equipada", "Diarista Inclusa", "Aceita Pets", "WC Exclusivo Piscina", "Quarto de Serviço"]
  },
  {
    id: "4",
    name: "Luxor Paulo Miranda Home Service - Cabo Branco",
    description: "O Luxor Paulo Miranda Home Service oferece piscina ao ar livre e vista para o mar em João Pessoa, a 14 km de Jacumã e 20 km de Cabedelo. WiFi gratuito em todos os ambientes. Unidades com área de estar/jantar e cozinha com forno. Dispõe de spa, academia, bilhar, aluguel de carros e bicicletas. Atividades como mergulho com snorkel e windsurf. Estacionamento privativo gratuito.",
    price: 200,
    capacity: 8,
    size: 45,
    image: "/lovable-uploads/328eb1c7-6522-489a-9d36-814da513ddb6.png",
    images: [
      "/lovable-uploads/709c81e5-3a69-4548-af2e-d3e05781f043.png", // Cozinha
      "/lovable-uploads/6a3791cc-0a09-4ac4-9cd4-eb9a93294b24.png", // Sala de Estar
      "/lovable-uploads/ca58c4d1-672d-4213-9c60-9eb0a87aba48.png", // Quarto Infantil
      "/lovable-uploads/b7504d41-4ab1-44bf-b051-c89177ffcd86.png", // Quarto Principal
      "/lovable-uploads/4210b2b4-8bb0-4a51-930b-7ce8a838e1aa.png", // Banheiro
    ],
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
    images: [
      "/lovable-uploads/e190a916-271a-4df1-8310-9cb3bd9d4514.png", // Área de Serviço
      "/lovable-uploads/696c44e5-e246-46e2-9259-e832667a624e.png", // Quarto Casal
      "/lovable-uploads/6a3b7fe2-1138-4672-986f-f76b0f1d4154.png", // Quarto Solteiro
      "/lovable-uploads/dbd72632-9c3f-492f-99cf-3f53871650b7.png", // Cozinha
      "/lovable-uploads/23b845b0-2b4d-40d5-9afc-085b9175e943.png", // Sala de Estar
    ],
    location: "Intermares - Frente à Praia",
    features: ["2 Quartos", "Cozinha Equipada", "Água Quente", "Piscina", "Área de Festa", "Frente à Praia", "Máquina de Lavar", "Área de Lazer", "À Beira-Mar", "Geladeira"]
  },
  {
    id: "6",
    name: "Luxor Cabo Branco Home Service",
    description: "Situado a 70 metros da Praia de Cabo Branco e a 2,7 km de Tambaú, o Luxor Cabo Branco Home Service oferece quartos com ar-condicionado e banheiro privativo em João Pessoa. Esta propriedade à beira-mar oferece acesso a uma varanda, mesa de bilhar, estacionamento privativo gratuito e WiFi gratuito. O apartamento oferece vista do jardim, parquinho infantil e recepção 24 horas. O apartamento dispõe de terraço, vista do mar, área de estar, TV de tela plana a cabo, cozinha totalmente equipada com micro-ondas e torradeira e banheiro privativo com chuveiro e secador de cabelo. Geladeira, utensílios de cozinha e cafeteira também são oferecidos. No complexo de apartamentos, as unidades incluem roupa de cama e toalhas. Um minimercado está disponível no apartamento. Você pode desfrutar de atividades em João Pessoa e nos arredores, como trilhas a pé. Você pode nadar na piscina ao ar livre, relaxar no jardim, andar de bicicleta ou pescar. O Farol do Cabo Branco fica a 5,5 km do Luxor Cabo Branco Home Service, enquanto a Estação de Trem está a 11 km da propriedade. O Aeroporto Internacional Presidente Castro Pinto fica a 21 km de distância.",
    price: 200,
    capacity: 6,
    size: 49,
    image: "/lovable-uploads/ca37793c-78c3-4b9d-95bf-f91affd3c3fd.png",
    images: [
      "/lovable-uploads/03a3f409-ea9a-4c81-b8df-3df82fa6fa6d.png", // Sala de Estar
      "/lovable-uploads/e7ec0251-1194-47b2-874d-33d09b921eb0.png", // Quarto Duplo
      "/lovable-uploads/62486238-bd35-4147-b1d1-669d66d3f385.png", // Banheiro
      "/lovable-uploads/817d4b4a-f834-46e0-8927-e37b4f83dbd7.png", // Cozinha
      "/lovable-uploads/fadeb56d-5ef8-4388-a040-47398729b935.png", // Quarto Casal
    ],
    location: "João Pessoa - Cabo Branco",
    features: ["WiFi Gratuito", "Ar Condicionado", "Estacionamento Privativo", "Vista do Jardim", "Parquinho Infantil", "Recepção 24h", "Mesa de Bilhar", "70m da Praia", "Varanda", "Banheiro Privativo", "Vista do Mar", "Terraço", "TV Cabo", "Cozinha Equipada", "Piscina", "Minimercado", "Roupa de Cama", "Toalhas", "Trilhas", "Bicicleta", "Pesca"]
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
    features: ["Wi-Fi Grátis", "Ar Condicionado", "Estacionamento Privativo", "Jardim", "Terraço", "Churrasqueira", "PS3", "Banheira de Hidromassagem", "3 Quartos", "4 Banheiros", "Transfer Aeroporto", "Aluguel de Bicicleta", "Geladeira", "Forno", "Micro-ondas", "Roupa de Cama", "Toalhas", "Sala de Estar", "Área de Refeições"],
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
];

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [apartment, setApartment] = useState<ApartmentProps | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Find apartment by ID
    const foundApartment = allApartments.find(apt => apt.id === id);
    setApartment(foundApartment || null);
  }, [id]);

  if (!apartment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
            <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
            <p className="text-muted-foreground mb-6">O imóvel que você está procurando não existe.</p>
            <Button asChild className="android-touch">
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
        {/* Header Section */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex items-center mb-6">
              <Button asChild variant="ghost" size="sm" className="android-touch">
                <Link to="/apartments">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar aos Imóveis
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="relative">
                <ImageGallery 
                  images={apartment.images || []} 
                  mainImage={apartment.image}
                  apartmentName={apartment.name}
                />
              </div>
              
              {/* Details */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{apartment.name}</h1>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{apartment.location}</span>
                </div>
                
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg mb-6">
                  <div className="flex items-center text-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="font-semibold">{apartment.capacity}</div>
                      <div className="text-sm text-muted-foreground">hóspedes</div>
                    </div>
                  </div>
                  <div className="flex items-center text-center">
                    <Maximize className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="font-semibold">{apartment.size}</div>
                      <div className="text-sm text-muted-foreground">m²</div>
                    </div>
                  </div>
                  <div className="flex items-center text-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="font-semibold">4.8</div>
                      <div className="text-sm text-muted-foreground">(24 avaliações)</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {apartment.description}
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Comodidades</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {apartment.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Wifi className="h-4 w-4 mr-2 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-3xl font-bold text-primary">R$ {apartment.price}</span>
                    <span className="text-muted-foreground"> / por noite</span>
                  </div>
                  <Button 
                    size="lg" 
                    className="btn-primary"
                    asChild
                  >
                    <Link to={`/apartments/${apartment.id}/contract`}>
                      Reservar Agora
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        
        {/* About Host Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Sobre o Anfitrião</h2>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">GF</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Gilberto Fernandes</h3>
                <p className="text-muted-foreground mb-4">CRECI 6531</p>
                <p className="text-muted-foreground max-w-2xl">
                  Com anos de experiência no mercado imobiliário da Paraíba, Gilberto oferece um atendimento personalizado 
                  e uma seleção cuidadosa de imóveis para garantir que sua estadia seja perfeita. Especialista em 
                  aluguel de temporada, ele conhece todos os melhores locais da região.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}