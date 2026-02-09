package backend.controllers.impl;

import backend.controllers.InterviewController;
import backend.utils.dtos.RequestPromptDTO;
import backend.models.PromptModel;
import backend.services.PromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class InterviewControllerImpl implements InterviewController {
    private final PromptService service;

    @Override
    public ResponseEntity<Void> generateNewPrompt(RequestPromptDTO data) {
        PromptModel prompt = new PromptModel();
        prompt.setType(data.type());
        prompt.setLevel(data.level());

        service.savePrompt(prompt);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
