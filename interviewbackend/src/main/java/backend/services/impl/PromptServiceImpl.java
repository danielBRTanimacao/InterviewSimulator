package backend.services.impl;

import backend.models.PromptModel;
import backend.repositories.PromptRepository;
import backend.services.PromptService;
import backend.utils.QuestionGenerator;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PromptServiceImpl implements PromptService {
    @Value("${spring.genai.key}")
    private String apiKey;

    //private final PromptRepository repository;

    @Override
    public void savePrompt(PromptModel data) {
        Client client = Client.builder().apiKey(apiKey).build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3-flash-preview",
                        QuestionGenerator.generateTemplate(data),
                        null);

        System.out.println(response.text());

        //repository.save(data);
    }
}
