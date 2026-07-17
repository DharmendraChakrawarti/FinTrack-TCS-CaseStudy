package practice.dc.financetracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false, length = 50)
    private String categoryName;

    @Column(name = "monthly_limit", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyLimit;

    @Column(name = "budget_month", nullable = false, length = 7)
    private String month; // Format: YYYY-MM

    @Column(name = "user_id", nullable = false)
    private Long userId;
}
