package practice.dc.financetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import practice.dc.financetracker.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndCategoryOrderByDateDesc(Long userId, String category);

    List<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, Transaction.TransactionType type);

    List<Transaction> findByUserIdAndTypeAndDateBetween(Long userId, Transaction.TransactionType type, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId AND t.type = :type AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndTypeAndDateBetween(
            @Param("userId") Long userId,
            @Param("type") Transaction.TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId AND t.type = :type AND t.date BETWEEN :startDate AND :endDate GROUP BY t.category")
    List<Object[]> sumAmountGroupByCategoryAndDateBetween(
            @Param("userId") Long userId,
            @Param("type") Transaction.TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId AND t.type = 'EXPENSE' AND t.category = :category AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByUserIdAndCategoryAndDateBetween(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
