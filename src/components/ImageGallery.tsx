import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  apartmentName: string;
}

export default function ImageGallery({ images, mainImage, apartmentName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Combine main image with additional images
  const allImages = [mainImage, ...(images || [])];
  
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div 
          className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <img 
            src={allImages[selectedImage]} 
            alt={`${apartmentName} - Imagem ${selectedImage + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Ver galeria completa
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {allImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                selectedImage === index 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image} 
                alt={`${apartmentName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <img 
              src={allImages[selectedImage]} 
              alt={`${apartmentName} - Imagem ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Navigation in Modal */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Image Counter in Modal */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImage + 1} de {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}