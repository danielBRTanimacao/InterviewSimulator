package backend.services.impl;

import backend.models.PromptModel;
import backend.repositories.PromptRepository;
import backend.services.PromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromptServiceImpl implements PromptService {
    private final PromptRepository repository;

    @Override
    public void savePrompt(PromptModel data) {
        repository.save(data);
    }

    @Override
    public List<PromptModel> listPrompts() {
        return repository.findAll();
    }
}
