package practice.dc.financetracker.service;

import org.springframework.stereotype.Service;
import practice.dc.financetracker.dto.TransactionRequest;
import practice.dc.financetracker.dto.TransactionResponse;
import practice.dc.financetracker.entity.Transaction;
import practice.dc.financetracker.repository.TransactionRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<TransactionResponse> getAllTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByCategory(Long userId, String category) {
        return transactionRepository.findByUserIdAndCategoryOrderByDateDesc(userId, category)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByType(Long userId, String type) {
        Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type.toUpperCase());
        return transactionRepository.findByUserIdAndTypeOrderByDateDesc(userId, transactionType)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .type(Transaction.TransactionType.valueOf(request.getType().toUpperCase()))
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .date(request.getDate())
                .userId(userId)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    public TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        transaction.setType(Transaction.TransactionType.valueOf(request.getType().toUpperCase()));
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());

        Transaction updated = transactionRepository.save(transaction);
        return mapToResponse(updated);
    }

    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        transactionRepository.delete(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .type(transaction.getType().name())
                .amount(transaction.getAmount())
                .category(transaction.getCategory())
                .description(transaction.getDescription())
                .date(transaction.getDate())
                .build();
    }
}
