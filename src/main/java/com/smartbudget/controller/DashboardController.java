package com.smartbudget.controller;

import com.smartbudget.dto.DashboardDTO;
import com.smartbudget.dto.ExpenseDTO;
import com.smartbudget.dto.IncomeDTO;
import com.smartbudget.entity.Budget;
import com.smartbudget.entity.Expense;
import com.smartbudget.entity.Income;
import com.smartbudget.entity.User;
import com.smartbudget.service.BudgetService;
import com.smartbudget.service.ExpenseService;
import com.smartbudget.service.IncomeService;
import com.smartbudget.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private UserService userService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all expenses and income
            List<Expense> expenses = expenseService.getExpensesByUserId(user.getId());
            List<Income> incomes = incomeService.getIncomeByUserId(user.getId());
            List<Budget> budgets = budgetService.getBudgetsByUserId(user.getId());

            // Calculate totals
            BigDecimal totalExpenses = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalIncome = incomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal balance = totalIncome.subtract(totalExpenses);

            // Get recent transactions (last 5)
            List<ExpenseDTO> recentExpenses = expenses.stream()
                    .sorted((a, b) -> b.getExpenseDate().compareTo(a.getExpenseDate()))
                    .limit(5)
                    .map(e -> new ExpenseDTO(e.getId(), e.getUser().getId(), e.getAmount(), e.getCategory(), e.getDescription(), e.getExpenseDate()))
                    .collect(Collectors.toList());

            List<IncomeDTO> recentIncome = incomes.stream()
                    .sorted((a, b) -> b.getIncomeDate().compareTo(a.getIncomeDate()))
                    .limit(5)
                    .map(i -> new IncomeDTO(i.getId(), i.getUser().getId(), i.getAmount(), i.getSource(), i.getIncomeDate()))
                    .collect(Collectors.toList());

            List<com.smartbudget.dto.BudgetDTO> budgetDTOs = budgets.stream()
                    .map(b -> new com.smartbudget.dto.BudgetDTO(b.getId(), b.getUser().getId(), b.getCategory(), b.getLimitAmount(), b.getStartDate(), b.getEndDate()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(DashboardDTO.builder()
                    .userId(user.getId())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .totalIncome(totalIncome)
                    .totalExpenses(totalExpenses)
                    .balance(balance)
                    .recentExpenses(recentExpenses)
                    .recentIncome(recentIncome)
                    .budgets(budgetDTOs)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving dashboard: " + e.getMessage());
        }
    }
}