package backend.utils;

import backend.models.PromptModel;
import backend.models.enums.TypeInterview;

public class QuestionGenerator {
    public static String generateTemplate(PromptModel model) {
        String contexto = (model.getType() == TypeInterview.TECHNICAL)
                ? "Foque em algoritmos, arquitetura e sintaxe."
                : "Foque em comportamento, resolução de conflitos e cultura.";

        return """
            Gere 5 perguntas para uma entrevista de nível %s.
            Tipo da entrevista: %s.
            Contexto: %s.
            Tags específicas: %s.
            Responda apenas em JSON.
            """.formatted(model.getLevel(), model.getType(), contexto, model.getTags());
    }
}
