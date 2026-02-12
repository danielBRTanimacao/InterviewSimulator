package backend.services.impl;

import backend.models.PromptModel;
import backend.services.PromptService;
import backend.utils.QuestionGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PromptServiceImpl implements PromptService {

    private final QuestionGenerator generator;

    @Override
    public void savePrompt(PromptModel data) {
        generator.contentImplement(data);

    }
}
