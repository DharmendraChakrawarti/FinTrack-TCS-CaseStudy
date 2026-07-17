package practice.dc.financetracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private CategoryType type;

    @Column(length = 30)
    private String icon;

    @Column(length = 7)
    private String color;

    @Column(name = "user_id")
    private Long userId; // null = default/system category

    public enum CategoryType {
        INCOME, EXPENSE
    }
}
