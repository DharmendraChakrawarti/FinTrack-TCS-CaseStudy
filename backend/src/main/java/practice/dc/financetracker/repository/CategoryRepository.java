package practice.dc.financetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import practice.dc.financetracker.entity.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserIdOrUserIdIsNull(Long userId);

    List<Category> findByUserIdIsNull();
}
