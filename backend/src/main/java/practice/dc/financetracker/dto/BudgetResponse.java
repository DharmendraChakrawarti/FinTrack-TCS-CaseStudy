package practice.dc.financetracker.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponse {

    private Long id;
    private String categoryName;
    private BigDecimal monthlyLimit;
    private BigDecimal spent;
    private BigDecimal remaining;
    private double percentUsed;
    private String month;
    private boolean overBudget;
}
