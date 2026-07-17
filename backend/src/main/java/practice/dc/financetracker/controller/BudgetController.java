package practice.dc.financetracker.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import practice.dc.financetracker.dto.BudgetRequest;
import practice.dc.financetracker.dto.BudgetResponse;
import practice.dc.financetracker.entity.User;
import practice.dc.financetracker.service.BudgetService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @AuthenticationPrincipal User user,
            @RequestParam String month) {
        return ResponseEntity.ok(budgetService.getBudgetsForMonth(user.getId(), month));
    }

    @PostMapping
    public ResponseEntity<?> createBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetRequest request) {
        try {
            BudgetResponse response = budgetService.createBudget(user.getId(), request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        try {
            BudgetResponse response = budgetService.updateBudget(user.getId(), id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        try {
            budgetService.deleteBudget(user.getId(), id);
            return ResponseEntity.ok(Map.of("message", "Budget deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
