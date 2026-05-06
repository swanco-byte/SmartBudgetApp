package com.smartbudget.repository;

import com.smartbudget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.category = :category")
    List<Budget> findByUserIdAndCategory(@Param("userId") Long userId, @Param("category") String category);
}