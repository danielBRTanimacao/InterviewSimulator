package backend.dtos;

import backend.models.enums.LevelInterview;
import backend.models.enums.TypeInterview;

public record RequestPromptDTO(
        TypeInterview type,
        LevelInterview level
) {}
