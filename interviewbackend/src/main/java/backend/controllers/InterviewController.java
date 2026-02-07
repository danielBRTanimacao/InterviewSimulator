package backend.controllers;

import backend.utils.dtos.RequestPromptDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/interviews")
public interface InterviewController {
    @PostMapping
    ResponseEntity<Void> createNewPrompt(@RequestBody RequestPromptDTO data);
}