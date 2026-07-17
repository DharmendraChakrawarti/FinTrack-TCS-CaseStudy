package practice.dc.financetracker.service;

import org.springframework.stereotype.Service;
import practice.dc.financetracker.dto.DashboardResponse;
import practice.dc.financetracker.dto.TransactionResponse;
import practice.dc.financetracker.entity.Transaction;
import practice.dc.financetracker.repository.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public DashboardResponse getDashboard(Long userId) {
        // Current month range
        YearMonth currentMonth = YearMonth.now();
        LocalDate monthStart = currentMonth.atDay(1);
        LocalDate monthEnd = currentMonth.atEndOfMonth();

        // Totals for current month
        BigDecimal totalIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                userId, Transaction.TransactionType.INCOME, monthStart, monthEnd);
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                userId, Transaction.TransactionType.EXPENSE, monthStart, monthEnd);
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        // Expense by category (current month)
        List<Object[]> expenseData = transactionRepository.sumAmountGroupByCategoryAndDateBetween(
                userId, Transaction.TransactionType.EXPENSE, monthStart, monthEnd);
        List<Map<String, Object>> expenseByCategory = expenseData.stream()
                .map(row -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("name", row[0]);
                    map.put("value", ((BigDecimal) row[1]).doubleValue());
                    return map;
                }).collect(Collectors.toList());

        // Income by category (current month)
        List<Object[]> incomeData = transactionRepository.sumAmountGroupByCategoryAndDateBetween(
                userId, Transaction.TransactionType.INCOME, monthStart, monthEnd);
        List<Map<String, Object>> incomeByCategory = incomeData.stream()
                .map(row -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("name", row[0]);
                    map.put("value", ((BigDecimal) row[1]).doubleValue());
                    return map;
                }).collect(Collectors.toList());

        // Monthly trend (last 6 months)
        List<Map<String, Object>> monthlyTrend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal income = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    userId, Transaction.TransactionType.INCOME, start, end);
            BigDecimal expense = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    userId, Transaction.TransactionType.EXPENSE, start, end);

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("month", ym.getMonth().name().substring(0, 3));
            point.put("income", income.doubleValue());
            point.put("expense", expense.doubleValue());
            monthlyTrend.add(point);
        }

        // Recent transactions (last 5)
        List<TransactionResponse> recentTransactions = transactionRepository
                .findByUserIdOrderByDateDesc(userId)
                .stream()
                .limit(5)
                .map(t -> TransactionResponse.builder()
                        .id(t.getId())
                        .type(t.getType().name())
                        .amount(t.getAmount())
                        .category(t.getCategory())
                        .description(t.getDescription())
                        .date(t.getDate())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .balance(balance)
                .expenseByCategory(expenseByCategory)
                .incomeByCategory(incomeByCategory)
                .monthlyTrend(monthlyTrend)
                .recentTransactions(recentTransactions)
                .build();
    }
}
