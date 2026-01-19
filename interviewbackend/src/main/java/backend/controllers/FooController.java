package backend.controllers;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class FooController {
    @Value("${spring.genai.key}")
    private String apiKey;

    @GetMapping
    public void getSomething() {
        Client client = Client.builder().apiKey(apiKey).build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3-flash-preview",
                        "gere uma pergunta técnica de java, sem alternativas",
                        null);

        System.out.println(response.text());
    }
}
