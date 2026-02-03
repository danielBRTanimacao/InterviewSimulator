package backend.utils;

import java.util.List;

public class QuestionGenerator {
    public static String generateTemplate(List<String> tags) {
        String formatedTags = String.join(",", tags);
        return """
            Gere 5 perguntas de entrevista baseadas nas tags: [%s].
            As perguntas devem ser técnicas se as tags envolverem linguagens ou ferramentas.
            Retorne o resultado estritamente em formato JSON:
            {
              "questoes": [
                { "id": 1, "pergunta": "...", "nivel": "..." }
              ]
            }
            """.formatted(formatedTags);
    }
}
