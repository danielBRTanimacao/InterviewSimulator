import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
            <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/10">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {!hasBegan ? (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-center justify-center text-center p-6">
                            <div className="max-w-md space-y-6 text-white">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">
                                        Tudo pronto?
                                    </h2>
                                    <p className="text-gray-400">
                                        Você responderá{" "}
                                        <strong>
                                            {questions.length} perguntas
                                        </strong>{" "}
                                        com um tempo limite de{" "}
                                        <strong>
                                            {formatTime(parseInt(timeLimit))}
                                        </strong>{" "}
                                        para cada uma.
                                    </p>
                                </div>

                                <div className="bg-white/10 p-4 rounded-xl text-sm text-left space-y-2 border border-white/10">
                                    <p>• Ligue sua câmera e microfone.</p>
                                    <p>
                                        • Clique em começar para a primeira
                                        pergunta.
                                    </p>
                                    <p>
                                        • Clique em continuar para a próxima
                                        questão.
                                    </p>
                                    <p>
                                        • Se o tempo acabar, o sistema pula
                                        automaticamente.
                                    </p>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={beginRecording}
                                    className="w-full h-14 text-xl gap-2 font-bold"
                                >
                                    <Play className="fill-current" /> Começar
                                    Agora
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="absolute top-6 left-6 z-20 flex gap-3">
                                <Badge
                                    variant="destructive"
                                    className="animate-pulse gap-2 px-3 py-1.5 text-sm uppercase font-bold"
                                >
                                    <div className="w-2.5 h-2.5 bg-white rounded-full" />{" "}
                                    Gravando
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="gap-2 px-3 py-1.5 font-mono text-sm bg-black/50 text-white backdrop-blur-md border-none"
                                >
                                    <Timer className="w-4 h-4 text-primary" />{" "}
                                    {formatTime(timeLeft)}
                                </Badge>
                            </div>

                            <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-12">
                                <div className="max-w-3xl mx-auto text-center">
                                    <span className="text-primary font-mono text-sm tracking-widest uppercase mb-2 block">
                                        Pergunta {currentQuestion + 1} de{" "}
                                        {questions.length}
                                    </span>
                                    <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight drop-shadow-md">
                                        "{questions[currentQuestion]}"
                                    </h2>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                <div className="max-w-xs mx-auto">
                                    <Button
                                        onClick={nextQuestion}
                                        size="lg"
                                        className="w-full h-14 text-lg font-bold rounded-full gap-2 shadow-2xl transition-transform active:scale-95"
                                    >
                                        {currentQuestion ===
                                        questions.length - 1
                                            ? "Finalizar e Salvar"
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
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-balance">
                    Prepare-se para o Próximo Nível
                </h1>
                <p className="text-muted-foreground mt-2">
                    Simule entrevistas reais com gravação local e controle de
                    tempo.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card
                    className={`cursor-pointer transition-all ${type === "TECHNICAL" ? "border-primary ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/50 opacity-80"}`}
                    onClick={() => setType("TECHNICAL")}
                >
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Code2 className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle>Técnica</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Foco em algoritmos, arquitetura de sistemas e
                            sintaxe de linguagens específicas.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card
                    className={`cursor-pointer transition-all ${type === "CULTURE" ? "border-primary ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/50 opacity-80"}`}
                    onClick={() => setType("CULTURE")}
                >
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Users className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle>Cultura & Comportamental</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Foco em soft skills, resolução de conflitos e
                            alinhamento com valores da empresa.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nível</label>
                        <Select onValueChange={setLevel} defaultValue={level}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Nível" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BEGINNER">
                                    Iniciante
                                </SelectItem>
                                <SelectItem value="JUNIOR">Junior</SelectItem>
                                <SelectItem value="PLENO">Pleno</SelectItem>
                                <SelectItem value="SENIOR">Senior</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tempo por questão
                        </label>
                        <Select
                            onValueChange={setTimeLimit}
                            defaultValue={timeLimit}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Tempo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="60">1 Minuto</SelectItem>
                                <SelectItem value="120">2 Minutos</SelectItem>
                                <SelectItem value="180">3 Minutos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tags de foco
                        </label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] bg-background items-center">
                            {tags.map((item) => (
                                <Badge
                                    key={item}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {item}
                                    <button
                                        type="button"
                                        onClick={(e) => removeTag(e, item)}
                                        className="hover:text-destructive"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 border-dashed gap-1"
                                        disabled={tags.length >= 5}
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="p-0 overflow-hidden">
                                    <Command>
                                        <CommandInput placeholder="Buscar tecnologia..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Não encontrado.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {TagsList.filter(
                                                    (t) =>
                                                        !tags.includes(
                                                            sanitizeTag(t),
                                                        ),
                                                ).map((tag) => (
                                                    <CommandItem
                                                        key={tag}
                                                        value={tag}
                                                        onSelect={() =>
                                                            handleSelectTag(tag)
                                                        }
                                                        className="cursor-pointer"
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
                    className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 gap-2"
                >
                    Gerar Simulado
                    <BrainCircuit className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
