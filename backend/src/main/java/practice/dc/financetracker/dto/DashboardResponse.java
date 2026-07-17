package practice.dc.financetracker.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;

    // Category-wise expense breakdown: [{name, value}]
    private List<Map<String, Object>> expenseByCategory;

    // Category-wise income breakdown: [{name, value}]
    private List<Map<String, Object>> incomeByCategory;

    // Monthly trend: [{month, income, expense}]
    private List<Map<String, Object>> monthlyTrend;

    // Recent transactions
    private List<TransactionResponse> recentTransactions;
}
