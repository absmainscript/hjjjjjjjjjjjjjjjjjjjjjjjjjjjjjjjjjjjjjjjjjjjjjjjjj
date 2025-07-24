import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Users,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Home,
  Palette,
  Star,
  GripVertical,
  Upload,
  Camera,
  Image,
  TrendingUp,
  Globe,
  Search,
  Ban,
  Target,
  Brain,
  Heart,
  BookOpen,
  Award,
  Shield,
  Sun,
  Moon,
  Sparkles,
  Handshake,
  MessageCircle,
  Leaf,
  Flower,
  Compass,
  ChevronUp,
  ChevronDown,
  TreePine,
  Wind,
  Umbrella,
  LifeBuoy,
  Puzzle,
  Waves,
  Mountain,
  Timer,
  Clock,
  Activity,
  Zap,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeroColorSettings } from "@/components/admin/HeroColorSettings";
import { SectionColorManager } from "@/components/admin/SectionColorManager";
import { ContactScheduleManager } from "@/components/admin/ContactScheduleManager";
import type {
  SiteConfig,
  Testimonial,
  FaqItem,
  Service,
  PhotoCarousel,
  Specialty,
} from "@shared/schema";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Componente para upload de imagem do Hero
function HeroImageUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Busca a imagem atual do hero
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/config");
      return response.json();
    },
  });

  useEffect(() => {
    const heroImage = configs?.find((c: any) => c.key === "hero_image");
    const imagePath = heroImage?.value?.path;
    // Reseta a imagem quando não há configuração ou está vazia
    setCurrentImage(imagePath && imagePath.trim() !== "" ? imagePath : null);
  }, [configs]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verifica se é uma imagem
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Verifica o tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/upload/hero", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      const result = await response.json();
      setCurrentImage(result.imagePath);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {currentImage && (
          <div className="relative">
            <img
              src={currentImage}
              alt="Foto de perfil atual"
              className="w-20 h-20 rounded-full object-cover border-2"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="file:mr-4 file:py-3 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 py-3"
          />
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG ou GIF. Máximo 5MB.
          </p>
        </div>
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Fazendo upload...
        </div>
      )}
      {currentImage && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                // Remove completamente a configuração hero_image usando fetch direto
                const response = await fetch("/api/admin/config/hero_image", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Atualiza o estado local
                setCurrentImage(null);

                // Invalida as queries para recarregar dados
                await queryClient.invalidateQueries({
                  queryKey: ["/api/admin/config"],
                });

                toast({
                  title: "Sucesso!",
                  description: "Avatar original restaurado com sucesso!",
                });
              } catch (error) {
                console.error("Erro ao redefinir foto:", error);
                toast({
                  title: "Erro",
                  description: "Erro ao redefinir foto.",
                  variant: "destructive",
                });
              }
            }}
            className="text-xs"
          >
            🔄 Voltar ao avatar original
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente para upload de foto de depoimento
function TestimonialImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/upload/testimonials", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      const result = await response.json();
      onChange(result.imagePath);
      toast({ title: "Sucesso!", description: "Foto do depoimento enviada!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Foto do depoimento"
              className="w-16 h-16 rounded-full object-cover border-2"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={removeImage}
            >
              ×
            </Button>
          </div>
        )}
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Opcional: Foto personalizada do cliente
          </p>
        </div>
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Fazendo upload...
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      setLocation("/09806446909");
    }
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem("admin_logged_in");
    setLocation("/09806446909");
  };

  // Queries
  const { data: siteConfigs = [] } = useQuery<SiteConfig[]>({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/config");
      return response.json();
    },
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/testimonials");
      return response.json();
    },
  });

  const { data: faqItems = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/faq");
      return response.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/services");
      return response.json();
    },
  });

  const { data: photoCarousel = [] } = useQuery<PhotoCarousel[]>({
    queryKey: ["/api/admin/photo-carousel"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/photo-carousel");
      return response.json();
    },
  });

  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["/api/admin/specialties"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/specialties");
      return response.json();
    },
  });

  const { data: contactSettings } = useQuery({
    queryKey: ["/api/admin/contact-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/contact-settings");
      return response.json();
    },
  });

  const { data: footerSettings } = useQuery({
    queryKey: ["/api/admin/footer-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/footer-settings");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Painel Admin
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Dra. Adrielle Benhossi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Home className="w-4 h-4 mr-2" />
                  Ver Site
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                onClick={logout}
                variant="destructive"
                size="sm"
                className="hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <Button
                onClick={logout}
                variant="destructive"
                size="sm"
                className="sm:hidden"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Banner */}
        {showWelcomeBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6"
          >
            <div
              className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-3 sm:p-4 relative touch-pan-x cursor-pointer select-none"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.dataset.startX = touch.clientX.toString();
                e.currentTarget.dataset.startY = touch.clientY.toString();
              }}
              onTouchMove={(e) => {
                const startX = parseFloat(
                  e.currentTarget.dataset.startX || "0",
                );
                const startY = parseFloat(
                  e.currentTarget.dataset.startY || "0",
                );
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;

                // Só processar swipe horizontal se for maior que vertical
                if (
                  Math.abs(deltaX) > Math.abs(deltaY) &&
                  Math.abs(deltaX) > 10
                ) {
                  e.currentTarget.style.transform = `translateX(${deltaX}px)`;
                  e.currentTarget.style.opacity = Math.max(
                    0.3,
                    1 - Math.abs(deltaX) / 200,
                  ).toString();
                }
              }}
              onTouchEnd={(e) => {
                const startX = parseFloat(
                  e.currentTarget.dataset.startX || "0",
                );
                const startY = parseFloat(
                  e.currentTarget.dataset.startY || "0",
                );
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;

                // Reset transform primeiro
                e.currentTarget.style.transform = "";
                e.currentTarget.style.opacity = "";

                // Se swipe horizontal for significativo (mais de 80px) e maior que vertical, fechar
                if (
                  Math.abs(deltaX) > 80 &&
                  Math.abs(deltaX) > Math.abs(deltaY)
                ) {
                  setShowWelcomeBanner(false);
                }
              }}
            >
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-600 hover:text-gray-800 transition-colors text-xl sm:text-lg font-bold bg-white/70 hover:bg-white/90 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-sm border border-gray-200"
                aria-label="Fechar notificação"
              >
                ×
              </button>
              <div className="pr-8 sm:pr-10">
                <h3 className="font-semibold text-purple-900 mb-1 sm:mb-2 text-sm sm:text-base">
                  👋 Bem-vinda, Leleli!
                </h3>
                <p className="text-xs sm:text-sm text-purple-800 leading-relaxed">
                  Aqui você personaliza tudo do seu site! Mexe nos textos,
                  cores, suas fotos, depoimentos dos pacientes, seus serviços,
                  FAQ e configura os pixels pro Facebook e Google. Toda mudança
                  já fica no ar na hora!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Navegação Unificada - Select Dropdown para Mobile e Desktop */}
            <div className="w-full">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-white border-gray-300 hover:border-purple-400 transition-colors">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {activeTab === "general" && "📋"}
                        {activeTab === "about" && "👩‍⚕️"}
                        {activeTab === "gallery" && "📸"}
                        {activeTab === "specialties" && "🎯"}
                        {activeTab === "testimonials" && "💬"}
                        {activeTab === "services" && "🔧"}
                        {activeTab === "faq" && "❓"}
                        {activeTab === "contact-schedule" && "📞"}
                        {activeTab === "footer" && "🦶"}
                        {activeTab === "visibility" && "👁️"}
                        {activeTab === "marketing" && "📊"}
                        {activeTab === "appearance" && "🎨"}
                      </span>
                      <span className="font-medium">
                        {activeTab === "general" && "Configurações Gerais"}
                        {activeTab === "about" && "Gerenciar Sobre"}
                        {activeTab === "gallery" && "Galeria de Fotos"}
                        {activeTab === "specialties" && "Minhas Especialidades"}
                        {activeTab === "testimonials" &&
                          "Gerenciar Depoimentos"}
                        {activeTab === "services" && "Gerenciar Serviços"}
                        {activeTab === "faq" && "Gerenciar FAQ"}
                        {activeTab === "contact-schedule" &&
                          "Contato e Horários"}
                        {activeTab === "footer" && "Gerenciar Rodapé"}
                        {activeTab === "visibility" && "Controlar Visibilidade"}
                        {activeTab === "marketing" && "Pixels de Marketing"}
                        {activeTab === "appearance" && "Personalizar Cores"}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Configurações do Site
                    </div>
                    <SelectItem value="general" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📋</span>
                        <div>
                          <div className="font-medium">
                            Configurações Gerais
                          </div>
                          <div className="text-xs text-gray-500">
                            Informações básicas, textos e foto
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="about" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">👩‍⚕️</span>
                        <div>
                          <div className="font-medium">Gerenciar Sobre</div>
                          <div className="text-xs text-gray-500">
                            Credenciais e qualificações
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="gallery" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📸</span>
                        <div>
                          <div className="font-medium">Galeria de Fotos</div>
                          <div className="text-xs text-gray-500">
                            Carrossel do consultório
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="specialties"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎯</span>
                        <div>
                          <div className="font-medium">
                            Minhas Especialidades
                          </div>
                          <div className="text-xs text-gray-500">
                            Áreas de atuação
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>

                  <div className="p-2 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Conteúdo
                    </div>
                    <SelectItem
                      value="testimonials"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💬</span>
                        <div>
                          <div className="font-medium">
                            Gerenciar Depoimentos
                          </div>
                          <div className="text-xs text-gray-500">
                            Avaliações de pacientes
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="services"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🔧</span>
                        <div>
                          <div className="font-medium">Gerenciar Serviços</div>
                          <div className="text-xs text-gray-500">
                            Tipos de atendimento e preços
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="faq" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">❓</span>
                        <div>
                          <div className="font-medium">Gerenciar FAQ</div>
                          <div className="text-xs text-gray-500">
                            Perguntas frequentes
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>

                  <div className="p-2 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Contato e Layout
                    </div>
                    <SelectItem
                      value="contact-schedule"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📞</span>
                        <div>
                          <div className="font-medium">Contato e Horários</div>
                          <div className="text-xs text-gray-500">
                            Botões e informações de contato
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="footer" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🦶</span>
                        <div>
                          <div className="font-medium">Gerenciar Rodapé</div>
                          <div className="text-xs text-gray-500">
                            Links e informações finais
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>

                  <div className="p-2 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Configurações Avançadas
                    </div>
                    <SelectItem
                      value="visibility"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">👁️</span>
                        <div>
                          <div className="font-medium">
                            Controlar Visibilidade
                          </div>
                          <div className="text-xs text-gray-500">
                            Mostrar/ocultar seções
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="marketing"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📊</span>
                        <div>
                          <div className="font-medium">Pixels de Marketing</div>
                          <div className="text-xs text-gray-500">
                            Facebook, Google Analytics
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="appearance"
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎨</span>
                        <div>
                          <div className="font-medium">Personalizar Cores</div>
                          <div className="text-xs text-gray-500">
                            Temas e paletas de cores
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser
                  redimensionados arrastando o canto inferior direito para
                  aumentar o tamanho.
                </p>
              </div>
              <div className="grid gap-6">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      Informações Básicas
                    </CardTitle>
                    <CardDescription>
                      Configure os dados principais: nome, CRP, descrição e foto
                      de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BasicInfoForm configs={siteConfigs} />
                  </CardContent>
                </Card>

                {/* Seção Hero */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">🏠</span>
                      Seção Principal (Hero)
                    </CardTitle>
                    <CardDescription>
                      Configure a primeira seção que os visitantes veem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HeroSectionForm configs={siteConfigs} />
                  </CardContent>
                </Card>

                {/* Navegação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">🧭</span>
                      Menu de Navegação
                    </CardTitle>
                    <CardDescription>
                      Personalize os nomes dos botões do menu (apenas os nomes,
                      as funcionalidades permanecem)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NavigationForm configs={siteConfigs} />
                  </CardContent>
                </Card>

                {/* Modo Manutenção */}
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <span className="text-lg">🚧</span>
                      Modo de Manutenção
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                      Controle se o site fica público ou em manutenção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MaintenanceForm configs={siteConfigs} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser
                  redimensionados arrastando o canto inferior direito para
                  aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção Sobre */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Sobre
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção sobre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AboutSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Credenciais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🎓</span>
                    Gerenciar Credenciais
                  </CardTitle>
                  <CardDescription>
                    Configure as credenciais, qualificações e especializações
                    exibidas na seção "Sobre". Cada item aparece como um card
                    com gradiente personalizado na seção sobre a psicóloga.
                    Arraste e solte para reordenar a sequência de exibição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AboutCredentialsManager configs={siteConfigs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              {/* Configurações de Texto da Galeria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Galeria
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da galeria de
                    fotos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoCarouselTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Fotos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📸</span>
                    Gerenciar Fotos do Carrossel{" "}
                  </CardTitle>
                  <CardDescription>
                    Adicione, edite e organize as fotos do consultório. O
                    carrossel avança automaticamente a cada 6 segundos. Arraste
                    e solte para reordenar as fotos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoCarouselManager photoCarousel={photoCarousel} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specialties Tab */}
            <TabsContent value="specialties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Minhas Especialidades</CardTitle>
                  <CardDescription>
                    Configure suas áreas de especialização que aparecem na seção
                    "Sobre". Defina título, descrição, ícone e cor para cada
                    especialidade. Arraste e solte para reordenar por
                    prioridade.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SpecialtiesManager specialties={specialties} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser
                  redimensionados arrastando o canto inferior direito para
                  aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção Depoimentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Depoimentos
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção de
                    depoimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialsSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Depoimentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    Gerenciar Depoimentos
                  </CardTitle>
                  <CardDescription>
                    Aqui você adiciona, edita ou remove depoimentos dos seus
                    pacientes. Use avatares variados para representar diferentes
                    perfis de clientes. Arraste e solte para reordenar a
                    sequência de exibição no site.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialsManager testimonials={testimonials} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser
                  redimensionados arrastando o canto inferior direito para
                  aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Serviços
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção de
                    serviços
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServicesSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🔧</span>
                    Gerenciar Serviços
                  </CardTitle>
                  <CardDescription>
                    Configure os serviços que você oferece: título, descrição,
                    ícone e preços. Escolha entre 40+ ícones profissionais
                    organizados por categorias. Ative/desative serviços e
                    reordene usando arrastar e soltar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServicesManager services={services} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser
                  redimensionados arrastando o canto inferior direito para
                  aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção FAQ
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção de
                    FAQ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FaqSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">❓</span>
                    Gerenciar FAQ
                  </CardTitle>
                  <CardDescription>
                    Crie perguntas e respostas frequentes sobre seus serviços.
                    Ajude seus futuros pacientes esclarecendo dúvidas comuns.
                    Organize as perguntas arrastando para reordenar por
                    importância.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FaqManager faqItems={faqItems} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visibility Tab */}
            <TabsContent value="visibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visibilidade das Seções</CardTitle>
                  <CardDescription>
                    Controle quais seções do site estão visíveis para os
                    visitantes. Você pode temporariamente desativar seções
                    durante atualizações ou manutenção.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SectionVisibilitySettings configs={siteConfigs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marketing Tab */}
            <TabsContent value="marketing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Marketing</CardTitle>
                  <CardDescription>
                    Configure códigos de acompanhamento para medir visitas e
                    resultados. Google Analytics mostra estatísticas detalhadas.
                    Facebook Pixel permite criar anúncios direcionados. Cole os
                    códigos fornecidos por essas plataformas aqui.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarketingSettings configs={siteConfigs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Schedule Tab */}
            <TabsContent value="contact-schedule" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser
                  redimensionados arrastando o canto inferior direito para
                  aumentar o tamanho.
                </p>
              </div>

              {/* Configurações do Card de Agendamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Card de Agendamento
                  </CardTitle>
                  <CardDescription>
                    Configure os textos do card "Vamos conversar?" que aparece
                    na seção de contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulingCardForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Novo Gerenciador de Contato e Horários */}
              <ContactScheduleManager contactSettings={contactSettings} />
            </TabsContent>

            {/* Footer Tab */}
            <TabsContent value="footer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Rodapé</CardTitle>
                  <CardDescription>
                    Configure todos os elementos do rodapé: textos, botões de
                    contato, certificações, selos de confiança, informações de
                    copyright e CNPJ. Personalize cores, ícones e ordenação.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FooterManager footerSettings={footerSettings} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="grid gap-6">
                {/* Gerenciador de Cores por Seção */}
                <SectionColorManager configs={siteConfigs} />

                {/* Configurações Globais de Aparência */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cores Globais do Sistema</CardTitle>
                    <CardDescription>
                      Configure as cores principais que afetam botões, links e
                      elementos interativos em todo o site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppearanceSettings configs={siteConfigs} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-400">
            Made with <span className="text-yellow-500">♥</span> by{" "}
            <span className="font-mono">∞</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Photo Carousel Image Upload
function PhotoCarouselImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/upload/carousel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      const result = await response.json();
      onChange(result.imagePath);
      toast({ title: "Sucesso!", description: "Foto do carrossel enviada!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Foto do carrossel"
              className="w-20 h-16 rounded object-cover border-2"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={removeImage}
            >
              ×
            </Button>
          </div>
        )}
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Foto para o carrossel (recomendado: 1200x600px)
          </p>
        </div>
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Fazendo upload...
        </div>
      )}
    </div>
  );
}

function PhotoCarouselManager({
  photoCarousel,
}: {
  photoCarousel: PhotoCarousel[];
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<PhotoCarousel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const photoSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    imageUrl: z.string().min(1, "Imagem é obrigatória"),
    showText: z.boolean(),
    isActive: z.boolean(),
    order: z.number().min(0),
  });

  type PhotoForm = z.infer<typeof photoSchema>;

  const form = useForm<PhotoForm>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      showText: true,
      isActive: true,
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PhotoForm) => {
      const response = await apiRequest(
        "POST",
        "/api/admin/photo-carousel",
        data,
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/photo-carousel"],
      });
      toast({ title: "Foto adicionada com sucesso!" });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PhotoForm>;
    }) => {
      const response = await apiRequest(
        "PUT",
        `/api/admin/photo-carousel/${id}`,
        data,
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/photo-carousel"],
      });
      toast({ title: "Foto atualizada com sucesso!" });
      setEditingItem(null);
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(
        "DELETE",
        `/api/admin/photo-carousel/${id}`,
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/photo-carousel"],
      });
      toast({ title: "Foto excluída com sucesso!" });
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = photoCarousel.findIndex((item) => item.id === active.id);
      const newIndex = photoCarousel.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(photoCarousel, oldIndex, newIndex);

      const updatePromises = newOrder.map((item, index) =>
        apiRequest("PUT", `/api/admin/photo-carousel/${item.id}`, {
          order: index,
        }),
      );

      Promise.all(updatePromises)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["/api/admin/photo-carousel"],
          });
          toast({ title: "Ordem das fotos atualizada!" });
        })
        .catch(() => {
          toast({ title: "Erro ao atualizar ordem", variant: "destructive" });
        });
    }
  };

  const onSubmit = (data: PhotoForm) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (photo: PhotoCarousel) => {
    setEditingItem(photo);

    setTimeout(() => {
      form.setValue("title", photo.title || "");
      form.setValue("description", photo.description || "");
      form.setValue("imageUrl", photo.imageUrl || "");
      form.setValue("showText", photo.showText ?? true);
      form.setValue("isActive", photo.isActive ?? true);
      form.setValue("order", photo.order || 0);
    }, 100);

    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Fotos do Carrossel</h3>
          <p className="text-sm text-muted-foreground">
            Carrossel automático com navegação manual e touch support
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Foto" : "Nova Foto"}
              </DialogTitle>
              <DialogDescription>
                Configure a foto e os textos do carrossel
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem</FormLabel>
                      <FormControl>
                        <PhotoCarouselImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ambiente Acolhedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição da foto..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="showText"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Mostrar Texto
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Exibir título e descrição
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Ativo</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Exibir no carrossel
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {editingItem ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Dica:</strong> Arraste e solte as fotos para reordenar. O
          carrossel avança automaticamente a cada 6 segundos.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={photoCarousel.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {photoCarousel
              .sort((a, b) => a.order - b.order)
              .map((photo) => (
                <SortablePhotoItem
                  key={photo.id}
                  photo={photo}
                  onEdit={() => openEditDialog(photo)}
                  onDelete={() => deleteMutation.mutate(photo.id)}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>

      {photoCarousel.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma foto cadastrada ainda.</p>
          <p className="text-sm">Clique em "Nova Foto" para começar.</p>
        </div>
      )}
    </div>
  );
}

function SortablePhotoItem({
  photo,
  onEdit,
  onDelete,
}: {
  photo: PhotoCarousel;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 cursor-move">
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-1 flex-shrink-0"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          {photo.imageUrl && (
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-16 h-12 sm:w-20 sm:h-16 rounded object-cover border flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-semibold text-sm sm:text-base truncate">
                {photo.title}
              </h4>
              <Badge
                variant={photo.isActive ? "default" : "secondary"}
                className="text-xs flex-shrink-0"
              >
                {photo.isActive ? "Ativo" : "Inativo"}
              </Badge>
              {photo.showText && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  Com Texto
                </Badge>
              )}
            </div>
            {photo.description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {photo.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">Ordem: {photo.order}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 sm:w-auto p-0 sm:px-3"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Editar</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 sm:w-auto p-0 sm:px-3"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Excluir</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Componente para controlar visibilidade das seções
function SectionVisibilitySettings({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const visibilityConfig =
    (configs?.find((c) => c.key === "sections_visibility")?.value as any) || {};
  const orderConfig =
    (configs?.find((c) => c.key === "sections_order")?.value as any) || {};

  const defaultSections = [
    {
      key: "hero",
      name: "Seção Inicial (Hero)",
      description: "Primeira seção com foto, título principal e botões de ação",
      icon: "🏠",
      defaultVisible: true,
      order: 0,
    },
    {
      key: "about",
      name: "Seção Sobre",
      description: "Informações sobre a psicóloga, formação e experiência",
      icon: "👤",
      defaultVisible: true,
      order: 1,
    },
    {
      key: "services",
      name: "Seção Serviços",
      description: "Lista dos serviços oferecidos com preços e descrições",
      icon: "🔧",
      defaultVisible: true,
      order: 2,
    },
    {
      key: "testimonials",
      name: "Seção Depoimentos",
      description: "Depoimentos e avaliações de pacientes",
      icon: "💬",
      defaultVisible: true,
      order: 3,
    },
    {
      key: "faq",
      name: "Seção FAQ",
      description: "Perguntas e respostas frequentes",
      icon: "❓",
      defaultVisible: true,
      order: 4,
    },
    {
      key: "inspirational",
      name: "Seção Citação Inspiracional",
      description: "Frase motivacional e autor da citação",
      icon: "💭",
      defaultVisible: true,
      order: 5,
    },
    {
      key: "photo-carousel",
      name: "Seção Galeria de Fotos",
      description: "Carrossel de fotos do consultório e ambiente",
      icon: "📸",
      defaultVisible: true,
      order: 3.5,
    },
    {
      key: "contact",
      name: "Seção Contato",
      description: "Informações de contato e formulário",
      icon: "📞",
      defaultVisible: true,
      order: 6,
    },
  ];

  // Ordena seções baseado na configuração salva
  const sections = defaultSections
    .map((section) => ({
      ...section,
      order: orderConfig[section.key] ?? section.order,
    }))
    .sort((a, b) => a.order - b.order);

  const [localSections, setLocalSections] = useState(sections);

  // Sensores otimizados para mobile e desktop
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Atualiza seções locais quando dados mudam
  useEffect(() => {
    const updatedSections = defaultSections
      .map((section) => ({
        ...section,
        order: orderConfig[section.key] ?? section.order,
      }))
      .sort((a, b) => a.order - b.order);
    setLocalSections(updatedSections);
  }, [configs]);

  const handleToggleSection = async (
    sectionKey: string,
    isVisible: boolean,
  ) => {
    try {
      const newVisibilityConfig = {
        ...visibilityConfig,
        [sectionKey]: isVisible,
      };

      await apiRequest("POST", "/api/admin/config", {
        key: "sections_visibility",
        value: newVisibilityConfig,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });

      toast({
        title: "Visibilidade atualizada!",
        description: `Seção ${sections.find((s) => s.key === sectionKey)?.name} ${isVisible ? "ativada" : "desativada"} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar visibilidade da seção.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localSections.findIndex((s) => s.key === active.id);
    const newIndex = localSections.findIndex((s) => s.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSections = arrayMove(localSections, oldIndex, newIndex);
    setLocalSections(newSections);

    try {
      // Cria novo objeto de ordem
      const newOrderConfig: Record<string, number> = {};
      newSections.forEach((section, index) => {
        newOrderConfig[section.key] = index;
      });

      await apiRequest("POST", "/api/admin/config", {
        key: "sections_order",
        value: newOrderConfig,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });

      toast({
        title: "Ordem atualizada!",
        description: "A nova ordem das seções foi salva com sucesso.",
      });
    } catch (error) {
      // Reverte em caso de erro
      setLocalSections(sections);
      toast({
        title: "Erro",
        description: "Erro ao salvar nova ordem das seções.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-lg">ℹ️</div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Como funciona</h4>
            <p className="text-sm text-blue-800">
              Use os controles abaixo para mostrar ou esconder seções inteiras
              do seu site. Seções desativadas ficam completamenteinvisíveis para
              os visitantes, mas você pode reativá-las a qualquer momento. Ideal
              para quando você está atualizando conteúdo ou quer temporariamente
              remover uma seção.
            </p>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localSections.map((s) => s.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4">
            {localSections.map((section) => (
              <SortableSectionItem
                key={section.key}
                section={section}
                isVisible={
                  visibilityConfig[section.key] ?? section.defaultVisible
                }
                onToggleVisibility={handleToggleSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 text-lg">⚠️</div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Importante</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>
                • Seções desativadas não aparecem para visitantes, mas seus
                dados são preservados
              </li>
              <li>
                • Você pode reativar seções a qualquer momento sem perder
                conteúdo
              </li>
              <li>
                • A seção de navegação (menu) sempre fica visível
                independentemente dessas configurações
              </li>
              <li>• Mudanças têm efeito imediato no site público</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente arrastável para item de seção
function SortableSectionItem({
  section,
  isVisible,
  onToggleVisibility,
}: {
  section: any;
  isVisible: boolean;
  onToggleVisibility: (key: string, visible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-item flex items-center justify-between p-4 border rounded-lg bg-white ${isDragging ? "dragging" : ""}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <div {...attributes} {...listeners} className="drag-handle p-2 -ml-2">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-2xl">{section.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{section.name}</h3>
            <Badge
              variant={isVisible ? "default" : "secondary"}
              className="text-xs"
            >
              {isVisible ? "Visível" : "Oculta"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{section.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) =>
            onToggleVisibility(section.key, checked)
          }
        />
        {isVisible ? (
          <Eye className="w-5 h-5 text-green-600" />
        ) : (
          <EyeOff className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );
}

// Componente para informações básicas
function BasicInfoForm({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const basicSchema = z.object({
    name: z.string().min(1, "Nome da psicóloga é obrigatório"),
    crp: z.string().min(1, "CRP é obrigatório"),
    siteName: z.string().min(1, "Nome do site é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    professionalTitle: z.string().min(1, "Título profissional é obrigatório"),
  });

  type BasicForm = z.infer<typeof basicSchema>;

  const getBasicData = () => {
    const generalInfo =
      (configs?.find((c) => c.key === "general_info")?.value as any) || {};
    const professionalTitleInfo =
      (configs?.find((c) => c.key === "professional_title")?.value as any) ||
      {};

    return {
      name: generalInfo.name || "Dra. Adrielle Benhossi",
      crp: generalInfo.crp || "08/123456",
      siteName: generalInfo.siteName || "Dra. Adrielle Benhossi - Psicóloga",
      description: generalInfo.description || "Psicóloga CRP 08/123456",
      professionalTitle: professionalTitleInfo.title || "Psicóloga Clínica",
    };
  };

  const form = useForm<BasicForm>({
    resolver: zodResolver(basicSchema),
    defaultValues: getBasicData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getBasicData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: BasicForm) => {
      const promises = [
        apiRequest("POST", "/api/admin/config", {
          key: "general_info",
          value: {
            name: data.name,
            crp: data.crp,
            siteName: data.siteName,
            description: data.description,
          },
        }),
        apiRequest("POST", "/api/admin/config", {
          key: "professional_title",
          value: {
            title: data.professionalTitle,
          },
        }),
      ];
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Informações básicas atualizadas com sucesso!" });
    },
  });

  const onSubmit = (data: BasicForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Upload de Foto de Perfil Hero */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Foto de Perfil Principal
        </h4>
        <p className="text-sm text-muted-foreground">
          Esta foto aparecerá automaticamente em todas as seções do site:
          Header, Hero, Footer e Seção Sobre.
        </p>
        <HeroImageUpload />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Psicóloga</FormLabel>
                  <FormControl>
                    <Input placeholder="Dra. Adrielle Benhossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRP</FormLabel>
                  <FormControl>
                    <Input placeholder="08/123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dra. Adrielle Benhossi - Psicóloga"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Psicóloga CRP 08/123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professionalTitle"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Título Profissional</FormLabel>
                  <FormControl>
                    <Input placeholder="Psicóloga Clínica" {...field} />
                  </FormControl>
                  <FormDescription>
                    Texto que aparece abaixo do nome na seção "Sobre"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending
              ? "Salvando..."
              : "Salvar Informações Básicas"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Componente para navegação
function NavigationForm({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const navSchema = z.object({
    navHome: z.string().min(1, "Menu: Início é obrigatório"),
    navAbout: z.string().min(1, "Menu: Sobre é obrigatório"),
    navServices: z.string().min(1, "Menu: Serviços é obrigatório"),
    navTestimonials: z.string().min(1, "Menu: Depoimentos é obrigatório"),
    navFaq: z.string().min(1, "Menu: FAQ é obrigatório"),
    navContact: z.string().min(1, "Menu: Contato é obrigatório"),
  });

  type NavForm = z.infer<typeof navSchema>;

  const getNavData = () => {
    const generalInfo =
      (configs?.find((c) => c.key === "general_info")?.value as any) || {};

    return {
      navHome: generalInfo.navHome || "Início",
      navAbout: generalInfo.navAbout || "Sobre",
      navServices: generalInfo.navServices || "Serviços",
      navTestimonials: generalInfo.navTestimonials || "Depoimentos",
      navFaq: generalInfo.navFaq || "FAQ",
      navContact: generalInfo.navContact || "Contato",
    };
  };

  const form = useForm<NavForm>({
    resolver: zodResolver(navSchema),
    defaultValues: getNavData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getNavData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: NavForm) => {
      const generalInfo =
        (configs?.find((c) => c.key === "general_info")?.value as any) || {};

      await apiRequest("POST", "/api/admin/config", {
        key: "general_info",
        value: {
          ...generalInfo,
          navHome: data.navHome,
          navAbout: data.navAbout,
          navServices: data.navServices,
          navTestimonials: data.navTestimonials,
          navFaq: data.navFaq,
          navContact: data.navContact,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Menu de navegação atualizado com sucesso!" });
    },
  });

  const onSubmit = (data: NavForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          ⚠️ <strong>Importante:</strong> Estes campos alteram apenas os nomes
          dos botões do menu. As funcionalidades permanecem as mesmas.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="navHome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu: Início</FormLabel>
                  <FormControl>
                    <Input placeholder="Início" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navAbout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu: Sobre</FormLabel>
                  <FormControl>
                    <Input placeholder="Sobre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu: Serviços</FormLabel>
                  <FormControl>
                    <Input placeholder="Serviços" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navTestimonials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu: Depoimentos</FormLabel>
                  <FormControl>
                    <Input placeholder="Depoimentos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navFaq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu: FAQ</FormLabel>
                  <FormControl>
                    <Input placeholder="FAQ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu: Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending
              ? "Salvando..."
              : "Salvar Menu de Navegação"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Componente para seção Hero
function HeroSectionForm({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const heroSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().min(1, "Subtítulo é obrigatório"),
    buttonText1: z.string().min(1, "Texto do botão 1 é obrigatório"),
    buttonText2: z.string().min(1, "Texto do botão 2 é obrigatório"),
  });

  type HeroForm = z.infer<typeof heroSchema>;

  const getHeroData = () => {
    const heroSection =
      (configs?.find((c) => c.key === "hero_section")?.value as any) || {};

    return {
      title: heroSection.title || "Cuidando da sua saúde mental com carinho",
      subtitle:
        heroSection.subtitle ||
        "Psicóloga especializada em terapia cognitivo-comportamental",
      buttonText1: heroSection.buttonText1 || "Agendar consulta",
      buttonText2: heroSection.buttonText2 || "Saiba mais",
    };
  };

  const form = useForm<HeroForm>({
    resolver: zodResolver(heroSchema),
    defaultValues: getHeroData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getHeroData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: HeroForm) => {
      await apiRequest("POST", "/api/admin/config", {
        key: "hero_section",
        value: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Seção Hero atualizada com sucesso!" });
    },
  });

  const onSubmit = (data: HeroForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800">
          🎨 Use (palavra) para aplicar cores degradê automáticas nos títulos.
          Exemplo: "Cuidando da sua (saúde mental)"
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título Principal ()</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cuidando da sua saúde mental com carinho"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Frase de impacto que define sua abordagem profissional. Use
                  (palavra) para efeito degradê.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Psicóloga especializada em terapia cognitivo-comportamental..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Descrição mais detalhada sobre sua especialização e abordagem
                  terapêutica
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="buttonText1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto Botão 1 (Principal)</FormLabel>
                  <FormControl>
                    <Input placeholder="Agendar consulta" {...field} />
                  </FormControl>
                  <FormDescription>
                    Botão principal que leva para a seção de contato
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonText2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto Botão 2 (Secundário)</FormLabel>
                  <FormControl>
                    <Input placeholder="Saiba mais" {...field} />
                  </FormControl>
                  <FormDescription>
                    Botão que rola a página para a seção "Sobre"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Salvando..." : "Salvar Seção Hero"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Componente para textos da seção About
function AboutSectionTextsForm({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const aboutSchema = z.object({
    badge: z.string().min(1, "Badge é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().min(1, "Subtítulo é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
  });

  type AboutTextsForm = z.infer<typeof aboutSchema>;

  const getAboutData = () => {
    const aboutSection =
      (configs?.find((c) => c.key === "about_section")?.value as any) || {};

    return {
      badge: aboutSection.badge || "SOBRE MIM",
      title: aboutSection.title || "Sobre Mim",
      subtitle: aboutSection.subtitle || "Psicóloga dedicada ao seu bem-estar",
      description:
        aboutSection.description ||
        "Com experiência em terapia cognitivo-comportamental, ofereço um espaço seguro e acolhedor para você trabalhar suas questões emocionais e desenvolver ferramentas para uma vida mais equilibrada.",
    };
  };

  const form = useForm<AboutTextsForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: getAboutData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getAboutData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: AboutTextsForm) => {
      await apiRequest("POST", "/api/admin/config", {
        key: "about_section",
        value: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Textos da seção Sobre atualizados com sucesso!" });
    },
  });

  const onSubmit = (data: AboutTextsForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800">
          🎨 Use (palavra) para aplicar cores degradê automáticas nos títulos.
          Exemplo: "Sobre (Mim)"
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge da Seção</FormLabel>
                <FormControl>
                  <Input placeholder="SOBRE MIM" {...field} />
                </FormControl>
                <FormDescription>
                  Pequeno texto em destaque acima do título principal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Seção Sobre ()</FormLabel>
                <FormControl>
                  <Input placeholder="Sobre Mim" {...field} />
                </FormControl>
                <FormDescription>
                  Título principal da seção. Use (palavra) para efeito degradê.
                  Ex: "Sobre (Mim)"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo da Seção</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Psicóloga dedicada ao seu bem-estar"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Subtítulo explicativo que aparece abaixo do título
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Descrição detalhada sobre sua experiência e abordagem
                  profissional
                </FormDescription>
                <FormMessage>
                  Descrição detalhada sobre sua experiência e abordagem
                  profissional
                </FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending
              ? "Salvando..."
              : "Salvar Textos da Seção Sobre"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Componente para textos da seção Services
function ServicesSectionTextsForm({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const servicesSchema = z.object({
    badge: z.string().min(1, "Badge é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().min(1, "Subtítulo é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
  });

  type ServicesTextsForm = z.infer<typeof servicesSchema>;

  const getServicesData = () => {
    const servicesSection =
      (configs?.find((c) => c.key === "services_section")?.value as any) || {};

    return {
      badge: servicesSection.badge || "SERVIÇOS",
      title: servicesSection.title || "Serviços",
      subtitle:
        servicesSection.subtitle ||
        "Cuidado especializado para cada necessidade",
      description:
        servicesSection.description ||
        "Cuidado personalizado e acolhedor para nutrir seu bem-estar emocional e mental",
    };
  };

  const form = useForm<ServicesTextsForm>({
    resolver: zodResolver(servicesSchema),
    defaultValues: getServicesData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getServicesData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: ServicesTextsForm) => {
      await apiRequest("POST", "/api/admin/config", {
        key: "services_section",
        value: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Textos da seção Serviços atualizados com sucesso!" });
    },
  });

  const onSubmit = (data: ServicesTextsForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800">
          🎨 Use (palavra) para aplicar cores degradê automáticas nos títulos.
          Exemplo: "Meus (Serviços)"
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge da Seção</FormLabel>
                <FormControl>
                  <Input placeholder="SERVIÇOS" {...field} />
                </FormControl>
                <FormDescription>
                  Pequeno texto em destaque acima do título principal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Seção Serviços ()</FormLabel>
                <FormControl>
                  <Input placeholder="Serviços" {...field} />
                </FormControl>
                <FormDescription>
                  Título principal da seção. Use (palavra) para efeito degradê.
                  Ex: "Meus (Serviços)"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo da Seção</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cuidado especializado para cada necessidade"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Subtítulo explicativo que aparece abaixo do título
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da Seção</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuidado personalizado e acolhedor para nutrir seu bem-estar emocional e mental"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Descrição explicativa sobre os serviços oferecidos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending
              ? "Salvando..."
              : "Salvar Textos da Seção Serviços"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Componente para textos da seção Testimonials
function TestimonialsSectionTextsForm({ configs }: { configs: SiteConfig[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const testimonialsSchema = z.object({
    badge: z.string().min(1, "Badge é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().min(1, "Subtítulo é obrigatório"),
  });

  type TestimonialsTextsForm = z.infer<typeof testimonialsSchema>;

  const getTestimonialsData = () => {
    const testimonialsSection =
      (configs?.find((c) => c.key === "testimonials_section")?.value as any) ||
      {};
    return {
      badge: testimonialsSection.badge || "DEPOIMENTOS",
      title: testimonialsSection.title || "Histórias de transformação",
      subtitle:
        testimonialsSection.subtitle ||
        "Experiências reais de pessoas que encontraram equilíbrio e bem-estar através do acompanhamento psicológico",
    };
  };

  const form = useForm<TestimonialsTextsForm>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: getTestimonialsData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getTestimonialsData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: TestimonialsTextsForm) => {
      await apiRequest("POST", "/api/admin/config", {
        key: "testimonials_section",
        value: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Textos da seção Depoimentos atualizados com sucesso!" });
    },
  });

  // ... restante do componente
}
