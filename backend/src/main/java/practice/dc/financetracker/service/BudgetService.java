package practice.dc.financetracker.service;

import org.springframework.stereotype.Service;
import practice.dc.financetracker.dto.BudgetRequest;
import practice.dc.financetracker.dto.BudgetResponse;
import practice.dc.financetracker.entity.Budget;
import practice.dc.financetracker.repository.BudgetRepository;
import practice.dc.financetracker.repository.TransactionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository, TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<BudgetResponse> getBudgetsForMonth(Long userId, String month) {
        List<Budget> budgets = budgetRepository.findByUserIdAndMonth(userId, month);
        return budgets.stream().map(b -> mapToResponse(userId, b)).collect(Collectors.toList());
    }

    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        // Check if budget already exists for this category+month
        budgetRepository.findByUserIdAndCategoryNameAndMonth(userId, request.getCategoryName(), request.getMonth())
                .ifPresent(existing -> {
                    throw new RuntimeException("Budget already exists for " + request.getCategoryName() + " in " + request.getMonth());
                });

        Budget budget = Budget.builder()
                .categoryName(request.getCategoryName())
                .monthlyLimit(request.getMonthlyLimit())
                .month(request.getMonth())
                .userId(userId)
                .build();

        Budget saved = budgetRepository.save(budget);
        return mapToResponse(userId, saved);
    }

    public BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to budget");
        }

        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setCategoryName(request.getCategoryName());
        budget.setMonth(request.getMonth());

        Budget updated = budgetRepository.save(budget);
        return mapToResponse(userId, updated);
    }

    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to budget");
        }

        budgetRepository.delete(budget);
    }

    private BudgetResponse mapToResponse(Long userId, Budget budget) {
        YearMonth ym = YearMonth.parse(budget.getMonth(), DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal spent = transactionRepository.sumExpenseByUserIdAndCategoryAndDateBetween(
                userId, budget.getCategoryName(), startDate, endDate);

        BigDecimal remaining = budget.getMonthlyLimit().subtract(spent);
        double percentUsed = budget.getMonthlyLimit().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(budget.getMonthlyLimit(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        return BudgetResponse.builder()
                .id(budget.getId())
                .categoryName(budget.getCategoryName())
                .monthlyLimit(budget.getMonthlyLimit())
                .spent(spent)
                .remaining(remaining)
                .percentUsed(Math.round(percentUsed * 100.0) / 100.0)
                .month(budget.getMonth())
                .overBudget(spent.compareTo(budget.getMonthlyLimit()) > 0)
                .build();
    }
}
