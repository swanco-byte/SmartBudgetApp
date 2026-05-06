package com.smartbudget.repository;

import com.smartbudget.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);
    
    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.incomeDate BETWEEN :startDate AND :endDate")
    List<Income> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                          @Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
}