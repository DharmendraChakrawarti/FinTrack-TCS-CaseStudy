package practice.dc.financetracker.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private String type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate date;
}
