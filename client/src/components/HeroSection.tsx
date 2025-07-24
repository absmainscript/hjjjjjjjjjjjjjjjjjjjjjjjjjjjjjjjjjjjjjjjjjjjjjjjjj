/**
 * HeroSection.tsx
 *
 * Seção principal da homepage do site da Dra. Adrielle Benhossi
 * Contém: título principal, subtítulo, botões de ação e avatar da psicóloga
 * Utiliza animações em Framer Motion para entrada suave dos elementos
 * Totalmente responsivo para dispositivos móveis com design aesthetic
 */

import { motion } from "framer-motion"; // Biblioteca para animações suaves
import { Calendar, Camera, Heart, Sparkles } from "lucide-react"; // Ícones para botões e decoração
import { Avatar } from "./Avatar"; // Componente do avatar da psicóloga
import { useQuery } from "@tanstack/react-query"; // Para buscar configurações do site
import { processTextWithGradient } from "@/utils/textGradient"; // Utilitário para processar texto com gradiente

export function HeroSection() {
  // Buscar configurações do site incluindo a imagem do hero
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/config");
      return response.json();
    },
  });

  // Extrair configurações dinâmicas
  const heroImage = configs?.find((c: any) => c.key === "hero_image");
  const customImage = heroImage?.value?.path || null;

  // Extrair informações gerais e da seção hero
  const generalInfo =
    (configs?.find((c: any) => c.key === "general_info")?.value as any) || {};
  const heroSection =
    (configs?.find((c: any) => c.key === "hero_section")?.value as any) || {};

  // Valores dinâmicos com fallbacks
  const psychologistName = generalInfo.name || "Dra. Adrielle Benhossi";
  const heroTitle =
    heroSection.title || "Cuidando da sua saúde mental com carinho";
  const heroSubtitle =
    heroSection.subtitle ||
    "Psicóloga especializada em terapia cognitivo-comportamental, oferecendo um espaço seguro e acolhedor para seu bem-estar emocional.";
  const schedulingButtonColor = generalInfo.schedulingButtonColor || "#ec4899";

  // Função para rolar suavemente até a seção de contato
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Função para rolar suavemente até a seção sobre
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const buttonText1 = heroSection.buttonText1 || "Agendar consulta";
  const buttonText2 = heroSection.buttonText2 || "Saiba mais";
  const buttonColor1 = heroSection.buttonColor1 || "#ec4899";
  const buttonColor2 = heroSection.buttonColor2 || "#8b5cf6";

  return (
    <section
      id="hero-section"
      data-section="hero"
      className="min-h-screen relative overflow-hidden w-full"
      style={{ margin: 0, padding: 0 }}
    >
      {/* Gradient Background com cores suaves e femininas */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50"></div>

      {/* Elementos decorativos flutuantes mais sutis */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-4 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-rose-200/30 to-pink-300/20 rounded-full blur-2xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-6 sm:top-40 sm:right-20 w-16 h-16 sm:w-28 sm:h-28 bg-gradient-to-br from-purple-200/25 to-indigo-300/20 rounded-full blur-xl"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-8 sm:bottom-32 sm:left-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-200/20 to-orange-300/15 rounded-full blur-lg"
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Layout Mobile - Mantém exatamente como está */}
          <div className="min-h-screen flex flex-col pt-20 pb-8 lg:hidden">

            {/* Seção da Foto - Mobile: ordem 1 */}
            <motion.div
              className="w-full flex justify-center items-center order-1 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative w-full max-w-sm">
                {/* Container principal da foto com glassmorphism aesthetic */}
                <div className="relative bg-white/50 backdrop-blur-2xl border border-white/50 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-purple-200/30 h-full">

                  {/* Decorações aesthetic ao redor do container */}
                  <div className="absolute -inset-2">
                    {/* Sparkles decorativos */}
                    <motion.div
                      className="absolute top-4 right-6 text-rose-300"
                      animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>

                    <motion.div
                      className="absolute bottom-8 left-4 text-purple-300"
                      animate={{ rotate: [360, 0], scale: [1, 0.8, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    >
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.div>

                    <motion.div
                      className="absolute top-12 left-2 text-pink-300"
                      animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-16 right-2 text-rose-300"
                      animate={{ x: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    >
                      <div className="w-1.5 h-1.5 bg-rose-300 rounded-full"></div>
                    </motion.div>
                  </div>

                  {/* Container da foto principal */}
                  <div className="relative">
                    {/* Foto de perfil responsiva */}
                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 rounded-2xl overflow-hidden relative border border-white/60 shadow-lg">

                      {/* Elementos decorativos internos da moldura */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                      <div className="absolute top-3 right-3 w-4 h-4 sm:w-6 sm:h-6 bg-white/40 rounded-full shadow-sm"></div>
                      <div className="absolute bottom-4 left-3 w-3 h-3 sm:w-4 sm:h-4 bg-rose-300/30 rounded-full"></div>
                      <div className="absolute top-1/3 left-2 w-2 h-2 sm:w-3 sm:h-3 bg-purple-300/25 rounded-full"></div>

                      {customImage ? (
                        <img
                          src={customImage}
                          alt={psychologistName}
                          className="w-full h-full object-cover object-center relative z-10"
                        />
                      ) : (
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-2 min-h-0">
                          {/* Avatar placeholder */}
                          <div className="mb-2 flex-shrink-0">
                            <Avatar size="lg" />
                          </div>

                          {/* Mensagem aesthetic para adicionar foto */}
                          <div className="text-center w-full px-2 flex-1 flex flex-col justify-center min-h-0">
                            <motion.div
                              className="mb-1.5 text-rose-400 flex-shrink-0"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Camera className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                            </motion.div>
                            <div className="space-y-0.5 flex-shrink-0">
                              <p className="text-rose-500 font-semibold text-xs sm:text-sm leading-tight">
                                ✨ Insira sua foto
                              </p>
                              <p className="text-gray-400 text-xs leading-tight">
                                Mostre seu sorriso
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Efeitos decorativos ao redor da foto */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-300/25 to-pink-400/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-300/20 to-indigo-400/15 rounded-full blur-2xl"></div>
                  </div>

                  {/* Texto decorativo sutil abaixo da foto */}
                  {customImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-center mt-4"
                    >
                      <p className="text-gray-500 text-sm font-light italic">
                        {psychologistName}
                      </p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-rose-300 to-purple-300 rounded-full mx-auto mt-2"></div>
                    </motion.div>
                  )}
                </div>

                {/* Elementos flutuantes aesthetic ao redor do container */}
                <motion.div
                  className="absolute -top-2 left-8 w-3 h-3 bg-rose-400/50 rounded-full"
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute -bottom-3 right-6 w-2 h-2 bg-purple-400/60 rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    x: [0, 6, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />

                <motion.div
                  className="absolute top-1/3 -right-2 w-1.5 h-1.5 bg-pink-400/70 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>
            </motion.div>

            {/* Conteúdo textual - Mobile: ordem 2 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center flex flex-col order-2"
            >
              {/* Card principal do conteúdo */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-200/20 flex flex-col h-full">
                {/* Título principal */}
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-800 mb-4 leading-tight tracking-tight">
                  {processTextWithGradient(heroTitle)}
                </h1>

                {/* Subtítulo/descrição */}
                <p className="text-lg sm:text-xl text-gray-600 mb-6 font-light leading-relaxed">
                  {heroSubtitle}
                </p>

                {/* Linha decorativa */}
                <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full mx-auto mb-6"></div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-auto">
                  {/* Botão principal - Agendamento */}
                  <button
                    onClick={scrollToContact}
                    className="group text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 flex-1 sm:flex-none sm:min-w-[180px]"
                    style={{
                      background: `linear-gradient(to right, ${schedulingButtonColor}, ${schedulingButtonColor}dd)`,
                      boxShadow: `0 10px 25px ${schedulingButtonColor}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 15px 35px ${schedulingButtonColor}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 10px 25px ${schedulingButtonColor}40`;
                    }}
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                    {buttonText1}
                  </button>

                  {/* Botão secundário - Saiba mais */}
                  <button
                    onClick={scrollToAbout}
                    className="bg-white/80 backdrop-blur-sm border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 sm:min-w-[140px]"
                    style={{
                      borderColor: `${buttonColor2}50`,
                      color: `${buttonColor2}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = buttonColor2;
                      e.currentTarget.style.color = buttonColor2;
                      e.currentTarget.style.boxShadow = `0 15px 35px ${buttonColor2}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${buttonColor2}50`;
                      e.currentTarget.style.color = buttonColor2;
                      e.currentTarget.style.boxShadow = `0 10px 25px rgba(156, 163, 175, 0.4)`;
                    }}
                  >
                    {buttonText2}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Layout Desktop - Completamente novo e reorganizado */}
          <div className="hidden lg:flex min-h-screen items-center pt-32 pb-20">
            <div className="w-full grid grid-cols-2 gap-16 items-center">

              {/* Lado Esquerdo - Conteúdo Textual */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center"
              >
                {/* Título principal */}
                <h1 className="font-display font-bold text-5xl xl:text-6xl text-gray-800 mb-6 leading-tight tracking-tight">
                  {processTextWithGradient(heroTitle)}
                </h1>

                {/* Subtítulo/descrição */}
                <p className="text-xl xl:text-2xl text-gray-600 mb-8 font-light leading-relaxed max-w-2xl">
                  {heroSubtitle}
                </p>

                {/* Linha decorativa */}
                <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full mb-10"></div>

                {/* Botões de ação */}
                <div className="flex gap-6">
                  {/* Botão principal - Agendamento */}
                  <button
                    onClick={scrollToContact}
                    className="group text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-3 min-w-[220px] justify-center"
                    style={{
                      background: `linear-gradient(to right, ${schedulingButtonColor}, ${schedulingButtonColor}dd)`,
                      boxShadow: `0 10px 25px ${schedulingButtonColor}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 15px 35px ${schedulingButtonColor}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 10px 25px ${schedulingButtonColor}40`;
                    }}
                  >
                    <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    {buttonText1}
                  </button>

                  {/* Botão secundário - Saiba mais */}
                  <button
                    onClick={scrollToAbout}
                    className="bg-white/80 backdrop-blur-sm border-2 px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-w-[180px] justify-center flex items-center"
                    style={{
                      borderColor: `${buttonColor2}50`,
                      color: `${buttonColor2}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = buttonColor2;
                      e.currentTarget.style.color = buttonColor2;
                      e.currentTarget.style.boxShadow = `0 15px 35px ${buttonColor2}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${buttonColor2}50`;
                      e.currentTarget.style.color = buttonColor2;
                      e.currentTarget.style.boxShadow = `0 10px 25px rgba(156, 163, 175, 0.4)`;
                    }}
                  >
                    {buttonText2}
                  </button>
                </div>
              </motion.div>

              {/* Lado Direito - Foto */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center items-center"
              >
                <div className="relative w-full max-w-xs">
                  {/* Container principal da foto */}
                  <div className="relative bg-white/50 backdrop-blur-2xl border border-white/50 rounded-3xl p-4 lg:p-6 xl:p-8 shadow-2xl shadow-purple-200/30">

                    {/* Decorações aesthetic ao redor do container */}
                    <div className="absolute -inset-2">
                      <motion.div
                        className="absolute top-3 lg:top-4 xl:top-6 right-4 lg:right-6 xl:right-8 text-rose-300"
                        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                      </motion.div>

                      <motion.div
                        className="absolute bottom-6 lg:bottom-8 xl:bottom-12 left-3 lg:left-4 xl:left-6 text-purple-300"
                        animate={{ rotate: [360, 0], scale: [1, 0.8, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      >
                        <Heart className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                      </motion.div>

                      <motion.div
                        className="absolute top-8 lg:top-12 xl:top-16 left-2 lg:left-3 xl:left-4 text-pink-300"
                        animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      >
                        <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 bg-pink-300 rounded-full"></div>
                      </motion.div>

                      <motion.div
                        className="absolute bottom-10 lg:bottom-14 xl:bottom-20 right-2 lg:right-3 xl:right-4 text-rose-300"
                        animate={{ x: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                      >
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 xl:w-2 xl:h-2 bg-rose-300 rounded-full"></div>
                      </motion.div>
                    </div>

                    {/* Container da foto principal */}
                    <div className="relative">
                      <div className="w-full aspect-[3/4] bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 rounded-2xl overflow-hidden relative border border-white/60 shadow-lg">

                        {/* Elementos decorativos internos */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                        <div className="absolute top-2 lg:top-3 xl:top-4 right-2 lg:right-3 xl:right-4 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 bg-white/40 rounded-full shadow-sm"></div>
                        <div className="absolute bottom-3 lg:bottom-4 xl:bottom-6 left-2 lg:left-3 xl:left-4 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 bg-rose-300/30 rounded-full"></div>
                        <div className="absolute top-1/3 left-1.5 lg:left-2 xl:left-3 w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 bg-purple-300/25 rounded-full"></div>

                        {customImage ? (
                          <img
                            src={customImage}
                            alt={psychologistName}
                            className="w-full h-full object-cover object-center relative z-10"
                          />
                        ) : (
                          <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 lg:p-4 xl:p-5 min-h-0">
                            <div className="mb-3 lg:mb-4 xl:mb-5 flex-shrink-0">
                              <Avatar size="lg" />
                            </div>

                            <div className="text-center w-full px-2 flex-1 flex flex-col justify-center min-h-0">
                              <motion.div
                                className="mb-2 lg:mb-2.5 xl:mb-3 text-rose-400 flex-shrink-0"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <Camera className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto" />
                              </motion.div>
                              <div className="space-y-1 lg:space-y-1.5 flex-shrink-0">
                                <p className="text-rose-500 font-semibold text-sm lg:text-base xl:text-lg leading-tight">
                                  ✨ Insira sua foto
                                </p>
                                <p className="text-gray-400 text-xs lg:text-sm xl:text-base leading-tight">
                                  Mostre seu sorriso
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Efeitos decorativos ao redor da foto */}
                      <div className="absolute -top-2 lg:-top-3 xl:-top-4 -right-2 lg:-right-3 xl:-right-4 w-12 h-12 lg:w-18 lg:h-18 xl:w-24 xl:h-24 bg-gradient-to-br from-rose-300/25 to-pink-400/20 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-3 lg:-bottom-4 xl:-bottom-6 -left-3 lg:-left-4 xl:-left-6 w-16 h-16 lg:w-22 lg:h-22 xl:w-28 xl:h-28 bg-gradient-to-br from-purple-300/20 to-indigo-400/15 rounded-full blur-2xl"></div>
                    </div>

                    {/* Texto decorativo sutil abaixo da foto */}
                    {customImage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center mt-3 lg:mt-4 xl:mt-6"
                      >
                        <p className="text-gray-500 text-sm lg:text-base xl:text-base font-light italic">
                          {psychologistName}
                        </p>
                        <div className="w-8 lg:w-10 xl:w-12 h-0.5 bg-gradient-to-r from-rose-300 to-purple-300 rounded-full mx-auto mt-2 lg:mt-2.5 xl:mt-3"></div>
                      </motion.div>
                    )}
                  </div>

                  {/* Elementos flutuantes aesthetic ao redor do container */}
                  <motion.div
                    className="absolute -top-2 lg:-top-3 xl:-top-3 left-8 lg:left-10 xl:left-12 w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 bg-rose-400/50 rounded-full"
                    animate={{
                      y: [0, -12, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute -bottom-3 lg:-bottom-3.5 xl:-bottom-4 right-6 lg:right-7 xl:right-8 w-2.5 h-2.5 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 bg-purple-400/60 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      x: [0, 6, 0],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />

                  <motion.div
                    className="absolute top-1/3 -right-2 lg:-right-2.5 xl:-right-3 w-1.5 h-1.5 lg:w-1.5 lg:h-1.5 xl:w-2 xl:h-2 bg-pink-400/70 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;