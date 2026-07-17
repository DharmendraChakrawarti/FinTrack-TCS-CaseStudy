package practice.dc.financetracker.service;

import org.springframework.stereotype.Service;
import practice.dc.financetracker.entity.Category;
import practice.dc.financetracker.repository.CategoryRepository;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getCategoriesForUser(Long userId) {
        return categoryRepository.findByUserIdOrUserIdIsNull(userId);
    }

    public Category createCategory(Long userId, Category category) {
        category.setUserId(userId);
        return categoryRepository.save(category);
    }
}
