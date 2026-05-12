package com.smartbudget.service;

import com.smartbudget.entity.Expense;
import com.smartbudget.entity.User;
import com.smartbudget.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public Map<String, BigDecimal> getExpensesByCategory(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
    }

    public Map<String, BigDecimal> getMonthlyExpenses(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> YearMonth.from(e.getExpenseDate()).toString(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                	    Map.Entry::getKey, 
                	    Map.Entry::getValue,
                	    (oldValue, newValue) -> oldValue, // Merge function (keeps existing value)
                	    LinkedHashMap::new               // Map supplier (maintains order)
                	));
    }

    public List<Map<String, Object>> getCategoryTrends(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory))
                .entrySet().stream()
                .map(entry -> Map.ofEntries(
                        Map.entry("category", (Object) entry.getKey()),
                        Map.entry("total", (Object) entry.getValue().stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add)),
                        Map.entry("count", (Object) entry.getValue().size())
                ))
                .sorted((a, b) -> ((BigDecimal) b.get("total")).compareTo((BigDecimal) a.get("total")))
                .collect(Collectors.toList());
    }
}