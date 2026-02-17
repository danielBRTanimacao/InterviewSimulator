import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Code2,
  Users,
  BrainCircuit,
  X,
  Plus,
  ChevronRight,
  Timer,
  Play,
  CheckCircle2,
  MonitorIcon,
} from "lucide-react";

import TagsList from "../../assets/json/tags.json";

export default () => {
  const [type, setType] = useState<"TECHNICAL" | "CULTURE">("TECHNICAL");
  const [level, setLevel] = useState("JUNIOR");
  const [timeLimit, setTimeLimit] = useState("120");
  const [tags, setTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const [isStarted, setIsStarted] = useState(false);
  const [hasBegan, setHasBegan] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const questions = [
    "Fale um pouco sobre você e sua trajetória profissional.",
    "Como você lida com prazos apertados e pressão?",
    "Qual foi o desafio técnico mais difícil que você já enfrentou?",
    "Por que você quer trabalhar conosco?",
  ];

  const sanitizeTag = (tag: string) => {
    return tag
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "");
  };

  const handleSelectTag = (tag: string) => {
    const cleanTag = sanitizeTag(tag);
    if (tags.length < 5 && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setOpen(false);
  };

  const removeTag = (e: React.MouseEvent, tagToRemove: string) => {
    e.preventDefault();
    e.stopPropagation();
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const startSimulated = async () => {
    setIsStarted(true);
    setTimeLeft(parseInt(timeLimit));
  };

  const beginRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `entrevista-${Date.now()}.webm`;
        a.click();
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setHasBegan(true);
    } catch (err) {
      alert("Erro ao acessar câmera e áudio.");
      setIsStarted(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(parseInt(timeLimit));
    } else {
      finishSimulation();
    }
  };

  const finishSimulation = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsStarted(false);
    setHasBegan(false);
    setCurrentQuestion(0);
    alert("Simulado finalizado! O vídeo será baixado.");
  };

  useEffect(() => {
    if (hasBegan) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextQuestion();
            return parseInt(timeLimit);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasBegan, currentQuestion, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isStarted) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-500">
        <div className="relative w-full h-full md:h-auto max-w-6xl aspect-video bg-black md:rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border-0 md:border-4 border-zinc-800">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {!hasBegan ? (
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl z-30 flex items-center justify-center text-center p-6">
              <div className="max-w-md space-y-8 animate-in zoom-in-95 duration-300">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MonitorIcon className="w-8 h-8 text-stone-400" />
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    Check-in
                  </h2>
                  <p className="text-zinc-400 text-lg">
                    Serão <strong>{questions.length} questões</strong> com{" "}
                    <strong>{formatTime(parseInt(timeLimit))}</strong> para
                    cada.
                  </p>
                </div>

                <div className="grid gap-3 text-left">
                  {[
                    "Verifique sua iluminação e áudio",
                    "O tempo inicia após o clique no botão",
                    "O vídeo será baixado localmente no final",
                    "Responda com naturalidade",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-zinc-300 font-medium">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={beginRecording}
                  className="w-full h-16 text-xl gap-3 font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  <Play className="fill-current w-5 h-5" /> Iniciar Agora
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-red-500/10 text-red-500 border-red-500/20 backdrop-blur-md px-4 py-2 flex items-center gap-2 animate-pulse"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="font-bold tracking-wider">REC</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-black/40 text-white border-white/10 backdrop-blur-md px-4 py-2 font-mono text-lg"
                >
                  <Timer className="w-5 h-5 text-stone-400" />{" "}
                  {formatTime(timeLeft)}
                </Badge>
              </div>

              <div className="absolute top-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-stone-400 uppercase tracking-[0.2em] px-4 py-1 text-[10px] md:text-xs"
                  >
                    Pergunta {currentQuestion + 1} de {questions.length}
                  </Badge>
                  <h2 className="text-white text-xl md:text-4xl font-bold leading-tight drop-shadow-2xl">
                    {questions[currentQuestion]}
                  </h2>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="max-w-xs mx-auto">
                  <Button
                    onClick={nextQuestion}
                    size="lg"
                    className="w-full h-14 md:h-16 text-lg font-bold rounded-2xl gap-3 shadow-2xl transition-all hover:gap-5"
                  >
                    {currentQuestion === questions.length - 1
                      ? "Finalizar"
                      : "Continuar"}
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      <div className="container mx-auto py-12 px-4 max-w-5xl space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
            <BrainCircuit className="w-4 h-4" /> AI Simulation
          </div>
          <h1 className="text-2xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white">
            Prepare seu <span className="text-primary">Pitch</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
            Pratique em um ambiente seguro e analise sua performance técnica e
            comportamental.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              id: "TECHNICAL",
              title: "Hard Skills",
              icon: Code2,
              desc: "Algoritmos, sistemas e lógica.",
              color: "blue",
            },
            {
              id: "CULTURE",
              title: "Soft Skills",
              icon: Users,
              desc: "Cultura e comportamento.",
              color: "purple",
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setType(item.id as any)}
              className={`group relative cursor-pointer p-8 rounded-[2rem] transition-all duration-300 border-2 ${
                type === item.id
                  ? "bg-white dark:bg-zinc-900 border-primary shadow-2xl shadow-primary/10"
                  : "bg-transparent border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div
                className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  type === item.id
                    ? "bg-primary text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                {item.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {item.desc}
              </p>
              {type === item.id && (
                <div className="absolute top-6 right-6">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </section>

        <Card className="rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                  Nível
                </label>
                <Select onValueChange={setLevel} defaultValue={level}>
                  <SelectTrigger className="h-14 rounded-2xl border-2 bg-white dark:bg-zinc-950 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="BEGINNER">Iniciante</SelectItem>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                    <SelectItem value="PLENO">Pleno</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                  Time Limit
                </label>
                <Select onValueChange={setTimeLimit} defaultValue={timeLimit}>
                  <SelectTrigger className="h-14 rounded-2xl border-2 bg-white dark:bg-zinc-950 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="60">1 Minuto</SelectItem>
                    <SelectItem value="120">2 Minutos</SelectItem>
                    <SelectItem value="180">3 Minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                  Tech Focus
                </label>
                <div className="flex flex-wrap gap-2 min-h-[56px] p-2 bg-white dark:bg-zinc-950 border-2 rounded-2xl items-center">
                  {tags.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 rounded-lg bg-primary/10 text-primary border-none font-bold"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={(e) => removeTag(e, item)}
                        className="ml-2 hover:bg-primary/20 rounded-md p-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl border-dashed border-2 gap-2 text-zinc-400 hover:text-primary"
                        disabled={tags.length >= 5}
                      >
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 overflow-hidden rounded-xl border-none">
                      <Command className="rounded-none">
                        <CommandInput
                          placeholder="Search technology..."
                          className="h-16 border-none focus:ring-0"
                        />
                        <CommandList className="max-h-[300px]">
                          <CommandEmpty>Not found.</CommandEmpty>
                          <CommandGroup className="p-3">
                            {TagsList.filter(
                              (t) => !tags.includes(sanitizeTag(t)),
                            ).map((tag) => (
                              <CommandItem
                                key={tag}
                                value={tag}
                                onSelect={() => handleSelectTag(tag)}
                                className="rounded-xl h-12 mb-1 cursor-pointer font-medium"
                              >
                                {tag}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <Button
              onClick={startSimulated}
              className="
                            whitespace-normal
                            w-full h-20 text-lg font-black rounded-[1.5rem] bg-primary 
                            hover:bg-primary/90 shadow-2xl shadow-primary/30 gap-4 transition-all active:scale-[0.98]
                            "
            >
              Gerar Simulado Personalizado
              <BrainCircuit className="w-8 h-8 hidden sm:inline" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
