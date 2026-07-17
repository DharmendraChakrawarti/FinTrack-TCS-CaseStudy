package practice.dc.financetracker.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import practice.dc.financetracker.entity.User;
import practice.dc.financetracker.service.ExportService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportCsv(
            @AuthenticationPrincipal User user,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        byte[] csvData = exportService.exportToCsv(
                user.getId(), LocalDate.parse(startDate), LocalDate.parse(endDate));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finance_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(
            @AuthenticationPrincipal User user,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        byte[] pdfData = exportService.exportToPdf(
                user.getId(), LocalDate.parse(startDate), LocalDate.parse(endDate));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finance_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData);
    }
}
