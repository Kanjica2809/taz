
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Contato
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Entre em contato conosco para mais informações sobre nossos imóveis
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>
        
        {/* Contact Information */}
        <section className="section">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="animate-fade-in [animation-delay:100ms]">
                <h2 className="text-2xl font-bold mb-6 text-center">Entre em Contato</h2>
                
                <div className="android-card p-6 space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-3">WhatsApp</h3>
                      <a 
                        href="https://wa.me/5583986667429" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] android-touch"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Fale Conosco no WhatsApp
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-mail</h3>
                      <p className="text-muted-foreground">contato@gfimoveis.com</p>
                      <p className="text-muted-foreground">reservas@gfimoveis.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 8h às 18h<br />
                        Sábado: 8h às 14h<br />
                        Domingo: Plantão WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="section bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-muted-foreground">
                Encontre respostas para as dúvidas mais comuns sobre nossos imóveis
              </p>
            </div>
            
            <div className="mobile-grid">
              <div className="android-card p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Qual o horário de check-in e check-out?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Check-in a partir das 12h e check-out até às 12h. Horários flexíveis podem ser negociados.
                </p>
              </div>
              
              <div className="android-card p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Há estacionamento disponível?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A maioria de nossos imóveis possui estacionamento gratuito. Consulte na descrição de cada propriedade.
                </p>
              </div>
              
              <div className="android-card p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Aceita animais de estimação?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Alguns imóveis aceitam pets mediante consulta prévia e taxa adicional. Entre em contato para confirmar.
                </p>
              </div>
              
              <div className="android-card p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Como funciona a limpeza?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Limpeza completa incluída. Para estadias longas, limpeza semanal disponível mediante acordo.
                </p>
              </div>
              
              <div className="android-card p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Fazem transfer do aeroporto?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Oferecemos serviço de transfer mediante agendamento prévio. Consulte valores e disponibilidade.
                </p>
              </div>
              
              <div className="android-card p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Quais comodidades estão incluídas?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Wi-Fi, ar-condicionado, cozinha equipada e roupa de cama estão inclusos em todos os imóveis.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
