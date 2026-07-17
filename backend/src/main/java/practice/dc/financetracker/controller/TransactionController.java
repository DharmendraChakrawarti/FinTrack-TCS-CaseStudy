package practice.dc.financetracker.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import practice.dc.financetracker.dto.TransactionRequest;
import practice.dc.financetracker.dto.TransactionResponse;
import practice.dc.financetracker.entity.User;
import practice.dc.financetracker.service.TransactionService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type) {

        List<TransactionResponse> transactions;

        if (startDate != null && endDate != null) {
            transactions = transactionService.getTransactionsByDateRange(
                    user.getId(), LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else if (category != null) {
            transactions = transactionService.getTransactionsByCategory(user.getId(), category);
        } else if (type != null) {
            transactions = transactionService.getTransactionsByType(user.getId(), type);
        } else {
            transactions = transactionService.getAllTransactions(user.getId());
        }

        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TransactionRequest request) {
        try {
            TransactionResponse response = transactionService.createTransaction(user.getId(), request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        try {
            TransactionResponse response = transactionService.updateTransaction(user.getId(), id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        try {
            transactionService.deleteTransaction(user.getId(), id);
            return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
