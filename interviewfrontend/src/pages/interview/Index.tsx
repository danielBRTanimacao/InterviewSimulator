import { useState } from "react";
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
import { Code2, Users, BrainCircuit } from "lucide-react";

export default () => {
    const [type, setType] = useState<"TECHNICAL" | "CULTURE">("TECHNICAL");
    const [level, setLevel] = useState("JUNIOR");
    const [tags, setTags] = useState<string[]>([]);

    const addTag = () => {
        if (tags.length >= 5) {
            alert("Máximo de 5 tags atingido!");
            return;
        }

        const newTag = prompt("Digite a tecnologia (ex: React, Node):");

        if (newTag && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    Prepare-se para o Próximo Nível
                </h1>
                <p className="text-muted-foreground mt-2">
                    Configure sua entrevista simulada com IA.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card
                    className={`cursor-pointer transition-all ${type === "TECHNICAL" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
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
                    className={`cursor-pointer transition-all ${type === "CULTURE" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
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
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Nível da Experiência
                        </label>
                        <Select onValueChange={setLevel} defaultValue={level}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o nível" />
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
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] bg-background">
                            {tags.map((item, id) => (
                                <Badge
                                    key={id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {item}
                                    <button
                                        onClick={() => removeTag(item)}
                                        className="ml-1 hover:text-destructive text-xs font-bold"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}

                            {tags.length < 5 && (
                                <Badge
                                    variant="outline"
                                    onClick={addTag}
                                    className="cursor-pointer border-dashed hover:bg-accent"
                                >
                                    + Adicionar
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90">
                    Gerar Simulado
                    <BrainCircuit className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
