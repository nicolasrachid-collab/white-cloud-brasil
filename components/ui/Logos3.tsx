import React from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { BRANDS } from "@/constants";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "As Melhores Marcas",
  logos,
  className,
}: Logos3Props) => {
  // Se não fornecer logos, usar BRANDS
  const displayLogos: Logo[] = logos || BRANDS.map((brand, idx) => ({
    id: `brand-${idx}`,
    description: brand.name,
    image: brand.logo,
    className: "h-8 md:h-12 w-auto",
  }));

  React.useEffect(() => {
    const cleanupProblematicElements = () => {
      // Procurar e REMOVER qualquer div com opacity-60 grayscale
      const allDivs = document.querySelectorAll('div');
      let removedCount = 0;
      
      allDivs.forEach(div => {
        const classes = div.className || '';
        // Verificar se é a div específica mencionada pelo usuário
        const isProblematicDiv = (
          classes.includes('flex') && 
          classes.includes('flex-wrap') && 
          classes.includes('justify-center') && 
          (classes.includes('md:justify-between') || classes.includes('justify-between')) &&
          classes.includes('items-center') && 
          classes.includes('gap-8') && 
          classes.includes('opacity-60') && 
          classes.includes('grayscale')
        );
        
        // Verificar se é qualquer div com opacity-60 grayscale que contenha logos
        const hasOpacityAndGrayscale = classes.includes('opacity-60') && classes.includes('grayscale');
        
        if (isProblematicDiv || hasOpacityAndGrayscale) {
          // Verificar se contém imagens de logos (placehold.co com texto de marca)
          const images = div.querySelectorAll('img');
          const hasBrandImages = images.length > 0 && Array.from(images).some(img => {
            const src = img.src || '';
            return src.includes('placehold.co') && (
              src.includes('IGNITE') || src.includes('ELFBAR') || 
              src.includes('VAPORESSO') || src.includes('NASTY') ||
              src.includes('VOOPOO') || src.includes('SMOK') || 
              src.includes('GEEKVAPE')
            );
          });
          
          // Se for a div específica ou tiver imagens de marca, remover
          if (isProblematicDiv || hasBrandImages) {
            // Forçar remoção de opacity e filtros antes de remover
            div.style.opacity = '1';
            div.style.filter = 'none';
            div.style.webkitFilter = 'none';
            div.style.mozFilter = 'none';
            div.style.msFilter = 'none';
            // Remover classes problemáticas
            div.classList.remove('opacity-60', 'grayscale');
            // Remover a div completamente
            div.remove();
            removedCount++;
          }
        }
      });
      
      // Garantir que todas as imagens na seção de logos não tenham filtros
      const section = document.querySelector('.brand-logos-section');
      if (section) {
        const images = section.querySelectorAll('img');
        images.forEach(img => {
          // Forçar remoção de filtros via JavaScript
          img.style.filter = 'none';
          img.style.opacity = '1';
          img.style.webkitFilter = 'none';
          img.style.mozFilter = 'none';
          img.style.msFilter = 'none';
          // Remover classes problemáticas
          img.classList.remove('grayscale', 'opacity-60');
        });
      }
    };
    
    // Executar limpeza imediatamente e após delays
    cleanupProblematicElements();
    const timeout1 = setTimeout(cleanupProblematicElements, 100);
    const timeout2 = setTimeout(cleanupProblematicElements, 500);
    const timeout3 = setTimeout(cleanupProblematicElements, 2000);
    
    // Usar MutationObserver para detectar quando novas divs são adicionadas
    const observer = new MutationObserver(() => {
      cleanupProblematicElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      observer.disconnect();
    };
  }, [displayLogos]);

  return (
    <section className={`brand-logos-section border-t border-b border-gray-100 bg-white py-8 sm:py-12 ${className || ''}`}>
      <div className="container mx-auto px-3 sm:px-4">
        <h3 className="text-center font-bold text-gray-400 text-sm tracking-widest uppercase mb-8">
          {heading}
        </h3>
      </div>
      <div className="pt-4 md:pt-6 lg:pt-8">
        <div className="relative mx-auto flex items-center justify-center">
          <Carousel
            opts={{ 
              loop: true,
              align: "start",
              dragFree: true,
            }}
            plugins={[
              AutoScroll({ 
                playOnInit: true, 
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnFocusIn: false,
                direction: 'backward', // Garante que vai da direita para esquerda
              })
            ]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {/* Duplicar logos para criar efeito de scroll infinito suave */}
              {[...displayLogos, ...displayLogos].map((logo, index) => (
                <CarouselItem
                  key={`${logo.id}-${index}`}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-4 sm:mx-6 md:mx-8 flex shrink-0 items-center justify-center">
                    <div className="[&_img]:!filter-none [&_img]:!opacity-100">
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={`${logo.className || "h-8 md:h-12 w-auto"} !filter-none !opacity-100`}
                        style={{ filter: 'none !important', opacity: '1 !important' }}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos3 };

