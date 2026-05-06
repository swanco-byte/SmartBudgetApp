package com.smartbudget.service;

import com.smartbudget.entity.Income;
import com.smartbudget.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {
    @Autowired
    private IncomeRepository incomeRepository;

    public Income createIncome(Income income) {
        return incomeRepository.save(income);
    }

    public Optional<Income> getIncomeById(Long id) {
        return incomeRepository.findById(id);
    }

    public List<Income> getIncomeByUserId(Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    public List<Income> getIncomeByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return incomeRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public Income updateIncome(Income income) {
        return incomeRepository.save(income);
    }

    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}