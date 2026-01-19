package backend.repositories;

import backend.models.PromptModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromptRepository extends JpaRepository<PromptModel, Long> {
}
