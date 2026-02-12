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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Code2, Users, BrainCircuit, X, Plus } from "lucide-react";

import TagsList from "../../assets/json/tags.json";

export default () => {
    const [type, setType] = useState<"TECHNICAL" | "CULTURE">("TECHNICAL");
    const [level, setLevel] = useState("JUNIOR");
    const [tags, setTags] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const sanitizeTag = (tag: string) => {
        return tag
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300_\u036f]/g, "")
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
                                        className="hover:bg-muted rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
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
                                        <Plus className="w-3 h-3" />
                                        Adicionar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="p-0 overflow-hidden">
                                    <DialogHeader className="p-4 pb-0">
                                        <DialogTitle>
                                            Buscar Tecnologia
                                        </DialogTitle>
                                    </DialogHeader>
                                    <Command>
                                        <CommandInput placeholder="Ex: React, Java, Docker..." />
                                        <CommandList className="max-h-[300px]">
                                            <CommandEmpty>
                                                Nenhuma tecnologia encontrada.
                                            </CommandEmpty>
                                            <CommandGroup heading="Disponíveis">
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

                <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 gap-2">
                    Gerar Simulado
                    <BrainCircuit className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
