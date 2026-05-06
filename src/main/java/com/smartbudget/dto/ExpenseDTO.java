package com.smartbudget.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private Long id;
    private Long userId;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate expenseDate;
}