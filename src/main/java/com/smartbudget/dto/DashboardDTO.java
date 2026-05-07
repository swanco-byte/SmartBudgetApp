package com.smartbudget.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;
    private List<ExpenseDTO> recentExpenses;
    private List<IncomeDTO> recentIncome;
    private List<BudgetDTO> budgets;
}