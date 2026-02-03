package backend.controllers;

import backend.utils.dtos.RequestPromptDTO;
import backend.models.PromptModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/api")
public interface PromptController {
    @GetMapping
    ResponseEntity<List<PromptModel>> listAllPrompts();
    @PostMapping("/prompt")
    void getSomething();
    @PostMapping
    ResponseEntity<Void> createNewPrompt(@RequestBody RequestPromptDTO data);
}
