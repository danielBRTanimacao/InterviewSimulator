package backend.controllers.impl;

import backend.controllers.PromptController;
import backend.dtos.RequestPromptDTO;
import backend.models.PromptModel;
import backend.services.PromptService;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PromptControllerImpl implements PromptController {
    @Value("${spring.genai.key}")
    private String apiKey;

    private final PromptService service;

    @Override
    public ResponseEntity<List<PromptModel>> listAllPrompts() {
        return ResponseEntity.ok().body(service.listPrompts());
    }

    @Override
    public void getSomething() {
        Client client = Client.builder().apiKey(apiKey).build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3-flash-preview",
                        "gere uma pergunta técnica de java, sem alternativas",
                        null);

        System.out.println(response.text());
    }

    @Override
    public ResponseEntity<Void> createNewPrompt(RequestPromptDTO data) {
        PromptModel prompt = new PromptModel();
        prompt.setType(data.type());
        prompt.setLevel(data.level());

        service.savePrompt(prompt);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
