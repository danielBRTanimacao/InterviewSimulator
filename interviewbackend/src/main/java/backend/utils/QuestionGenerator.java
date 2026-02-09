package backend.utils;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import backend.models.PromptModel;
import backend.models.enums.TypeInterview;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class QuestionGenerator {

    @Value("${api.genai.key}")
    private String apiKey;
    
    public void contentImplement(PromptModel data) {
        Client client = Client.builder().apiKey(apiKey).build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3-flash-preview",
                        this.generateTemplate(data),
                        null);

        System.out.println(response.text());
    }

    public String generateTemplate(PromptModel model) {
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
