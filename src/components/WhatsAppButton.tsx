import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "5583986667429"; // Seu número com código do país
  const message = "Olá! Vi seu site e gostaria de saber mais sobre os imóveis para aluguel.";
  
  const handleWhatsAppClick = () => {
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 android-touch"
      aria-label="Entre em contato via WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
}