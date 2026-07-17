package practice.dc.financetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import practice.dc.financetracker.entity.Category;
import practice.dc.financetracker.entity.User;
import practice.dc.financetracker.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getCategories(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getCategoriesForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @AuthenticationPrincipal User user,
            @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(user.getId(), category));
    }
}
