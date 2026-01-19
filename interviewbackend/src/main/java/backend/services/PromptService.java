package backend.services;

import backend.models.PromptModel;

import java.util.List;

public interface PromptService {
    void savePrompt(PromptModel data);
    List<PromptModel> listPrompts();
}
