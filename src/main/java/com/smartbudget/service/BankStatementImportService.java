package com.smartbudget.service;

import com.smartbudget.dto.BankStatementImportRequest;
import com.smartbudget.entity.Expense;
import com.smartbudget.entity.Income;
import com.smartbudget.entity.User;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class BankStatementImportService {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private CategorySuggestionService categoryService;

    public Map<String, Object> importFromCSV(MultipartFile file, User user) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;
            int lineNumber = 0;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // Skip header
            reader.readLine();

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                try {
                    String[] parts = line.split(",");
                    if (parts.length < 4) {
                        errors.add("Line " + lineNumber + ": Invalid format");
                        failureCount++;
                        continue;
                    }

                    LocalDate date = LocalDate.parse(parts[0].trim(), formatter);
                    String description = parts[1].trim();
                    BigDecimal amount = new BigDecimal(parts[2].trim());
                    String type = parts[3].trim().toLowerCase();

                    if (type.equals("income")) {
                        Income income = new Income();
                        income.setUser(user);
                        income.setAmount(amount);
                        income.setSource(description);
                        income.setIncomeDate(date);
                        incomeRepository.save(income);
                        successCount++;
                    } else if (type.equals("expense")) {
                        Expense expense = new Expense();
                        expense.setUser(user);
                        expense.setAmount(amount);
                        expense.setDescription(description);
                        expense.setCategory(categoryService.suggestCategory(description));
                        expense.setExpenseDate(date);
                        expenseRepository.save(expense);
                        successCount++;
                    } else {
                        errors.add("Line " + lineNumber + ": Invalid type. Must be 'income' or 'expense'");
                        failureCount++;
                    }
                } catch (Exception e) {
                    errors.add("Line " + lineNumber + ": " + e.getMessage());
                    failureCount++;
                }
            }
            reader.close();
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error processing file: " + e.getMessage());
            return result;
        }

        result.put("success", true);
        result.put("successCount", successCount);
        result.put("failureCount", failureCount);
        result.put("errors", errors);
        result.put("message", "Import completed: " + successCount + " records imported, " + failureCount + " failed");
        return result;
    }

    public Map<String, Object> importFromJSON(BankStatementImportRequest request, User user) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failureCount = 0;
        List<String> errors = new ArrayList<>();

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            for (int i = 0; i < request.getTransactions().size(); i++) {
                try {
                    var transaction = request.getTransactions().get(i);
                    LocalDate date = LocalDate.parse(transaction.date, formatter);
                    BigDecimal amount = new BigDecimal(transaction.amount);
                    String type = transaction.type.toLowerCase();

                    if (type.equals("income")) {
                        Income income = new Income();
                        income.setUser(user);
                        income.setAmount(amount);
                        income.setSource(transaction.description);
                        income.setIncomeDate(date);
                        incomeRepository.save(income);
                        successCount++;
                    } else if (type.equals("expense")) {
                        Expense expense = new Expense();
                        expense.setUser(user);
                        expense.setAmount(amount);
                        expense.setDescription(transaction.description);
                        expense.setCategory(categoryService.suggestCategory(transaction.description));
                        expense.setExpenseDate(date);
                        expenseRepository.save(expense);
                        successCount++;
                    } else {
                        errors.add("Transaction " + (i + 1) + ": Invalid type");
                        failureCount++;
                    }
                } catch (Exception e) {
                    errors.add("Transaction " + (i + 1) + ": " + e.getMessage());
                    failureCount++;
                }
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error processing import: " + e.getMessage());
            return result;
        }

        result.put("success", true);
        result.put("successCount", successCount);
        result.put("failureCount", failureCount);
        result.put("errors", errors);
        result.put("message", "Import completed: " + successCount + " records imported");
        return result;
    }
}