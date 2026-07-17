package practice.dc.financetracker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BudgetRequest {

    @NotBlank(message = "Category name is required")
    private String categoryName;

    @NotNull(message = "Monthly limit is required")
    @DecimalMin(value = "1.00", message = "Monthly limit must be at least 1.00")
    private BigDecimal monthlyLimit;

    @NotBlank(message = "Month is required (YYYY-MM)")
    private String month;
}
