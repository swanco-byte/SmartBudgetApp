package com.smartbudget.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankStatementImportRequest {
    private List<TransactionRecord> transactions;
    private String importType; // csv, pdf, manual
}

