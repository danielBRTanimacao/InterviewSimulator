import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Lightbulb, MessageSquare } from "lucide-react";
import { useRef } from "react";

export default () => {
  const elementRef = useRef<HTMLHeadingElement | null>(null);
  const handleScroll = () => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">InterviewPro</span>
        </div>
        <div>
          <a href="/auth">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Button>
          </a>
          <a href="/interview" className="hidden sm:inline">
            <Button className="ml-2">Começar Grátis</Button>
          </a>
        </div>
      </nav>

      <section className="relative flex-grow flex items-center justify-center py-20 px-4 md:py-32 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('/hero-bg.svg')] bg-cover bg-center" />

        <div className="container mx-auto relative z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
            Domine Sua Próxima Entrevista <br className="hidden md:inline" />{" "}
            com <span className="text-blue-600">Confiança</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Prepare-se para qualquer desafio com nosso simulador de entrevista
            interativo, feedback inteligente e dicas personalizadas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/interview">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-300/50"
              >
                Começar Simulação Grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Button
              onClick={handleScroll}
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Ver Como Funciona <Lightbulb className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
            ref={elementRef}
          >
            Como o InterviewPro Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              icon={<Brain className="h-10 w-10 text-blue-500" />}
              title="1. Escolha seu Cenário"
              description="Selecione o tipo de entrevista (técnica, comportamental, etc.) e o nível de dificuldade."
            />
            <StepCard
              icon={<MessageSquare className="h-10 w-10 text-green-500" />}
              title="2. Responda às Perguntas"
              description="Use seu microfone para simular a entrevista e grave suas respostas."
            />
            <StepCard
              icon={<Lightbulb className="h-10 w-10 text-orange-500" />}
              title="3. Receba Feedback"
              description="Obtenha uma análise detalhada de suas respostas, pontos fortes e áreas para melhorar."
            />
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} InterviewPro. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
};

function StepCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transition-transform hover:scale-105">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
