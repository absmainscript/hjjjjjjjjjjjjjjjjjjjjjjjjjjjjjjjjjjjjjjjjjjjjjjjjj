import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { 
  Brain, Heart, Baby, Users, User,
  Stethoscope, Activity, Zap, Shield, Target,
  UserPlus, UserCheck, UserX, UserCog,
  Sun, Moon, Star, Sparkles,
  MessageCircle, MessageSquare, Mic, Volume2,
  TrendingUp, BarChart, PieChart, Gauge,
  Leaf, Flower, TreePine, Wind,
  Handshake, HelpCircle, LifeBuoy, Umbrella,
  Home, Gamepad2, Puzzle, Palette,
  Footprints, Waves, Mountain, Compass,
  Clock, Timer, Calendar, Hourglass
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  duration?: string;
  price?: string;
  showDuration: boolean;
  showPrice: boolean;
  isActive: boolean;
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          throw new Error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        // Fallback com serviços padrão
        setServices([
          {
            id: 1,
            title: "Psicoterapia Individual",
            description: "Atendimento personalizado focado no seu crescimento pessoal e bem-estar emocional.",
            icon: "Brain",
            gradient: "from-pink-500 to-purple-600",
            duration: "50 min",
            price: "R$ 150",
            showDuration: true,
            showPrice: true,
            isActive: true
          },
          {
            id: 2,
            title: "Terapia de Casal",
            description: "Fortalecimento de vínculos e resolução de conflitos para relacionamentos saudáveis.",
            icon: "Heart",
            gradient: "from-purple-500 to-indigo-600",
            duration: "1h 30min",
            price: "R$ 200",
            showDuration: true,
            showPrice: true,
            isActive: true
          },
          {
            id: 3,
            title: "Psicologia Infantil",
            description: "Cuidado especializado para o desenvolvimento emocional de crianças e adolescentes.",
            icon: "Baby",
            gradient: "from-indigo-500 to-pink-600",
            duration: "45 min",
            price: "R$ 130",
            showDuration: true,
            showPrice: true,
            isActive: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const activeServices = services.filter(service => service.isActive);

  return (
    <section id="services-section" data-section="services" className="py-20" ref={ref}>
      <div className="container mx-auto mobile-container max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full">
              SERVIÇOS
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6 tracking-tight">
            Como posso{" "}
            <span className="text-gradient font-medium">
              ajudar você?
            </span>
          </h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Oferecendo cuidado personalizado e especializado para cada momento da sua jornada de crescimento pessoal
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando serviços...</p>
          </div>
        ) : activeServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum serviço disponível no momento.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeServices.map((service, index) => {
              // Mapeamento completo de ícones
              const iconMap: Record<string, any> = {
                // Ícones Principais
                Brain, Heart, Baby, Users, User,
                // Ícones de Saúde Mental
                Stethoscope, Activity, Zap, Shield, Target,
                // Ícones de Relacionamento
                UserPlus, UserCheck, UserX, UserCog,
                // Ícones de Bem-estar
                Sun, Moon, Star, Sparkles,
                // Ícones de Comunicação
                MessageCircle, MessageSquare, Mic, Volume2,
                // Ícones de Crescimento
                TrendingUp, BarChart, PieChart, Gauge,
                // Ícones de Mindfulness
                Leaf, Flower, TreePine, Wind,
                // Ícones de Apoio
                Handshake, HelpCircle, LifeBuoy, Umbrella,
                // Ícones de Família
                Home, Gamepad2, Puzzle, Palette,
                // Ícones de Movimento
                Footprints, Waves, Mountain, Compass,
                // Ícones de Tempo
                Clock, Timer, Calendar, Hourglass
              };

              const IconComponent = iconMap[service.icon] || Brain;

              return (
                <motion.div
                  key={service.id}
                  className="glass-strong p-8 rounded-3xl text-center hover:scale-[1.03] transition-all duration-700 ease-out flex flex-col h-full cursor-pointer shadow-subtle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-subtle`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>
                  {(service.showDuration || service.showPrice) && (
                    <div className={`${index === 1 ? 'text-purple-600' : 'text-pink-500'} font-semibold text-lg mt-auto`}>
                      {service.showDuration && service.duration}
                      {service.showDuration && service.showPrice && " • "}
                      {service.showPrice && service.price}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}