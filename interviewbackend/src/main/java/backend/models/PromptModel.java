package backend.models;

import backend.models.enums.LevelInterview;
import backend.models.enums.TypeInterview;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PromptModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeInterview type;
    @Enumerated(EnumType.STRING)
    private LevelInterview level;

    private String tags;
}
