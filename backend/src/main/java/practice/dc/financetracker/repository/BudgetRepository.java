package practice.dc.financetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import practice.dc.financetracker.entity.Budget;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdAndMonth(Long userId, String month);

    Optional<Budget> findByUserIdAndCategoryNameAndMonth(Long userId, String categoryName, String month);

    List<Budget> findByUserId(Long userId);
}
