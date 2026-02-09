package backend.models;

import backend.models.enums.LevelInterview;
import backend.models.enums.TagsInterview;
import backend.models.enums.TypeInterview;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

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

    @ElementCollection(targetClass = TagsInterview.class)
    @Enumerated(EnumType.STRING)
    private List<TagsInterview> tags;
}
