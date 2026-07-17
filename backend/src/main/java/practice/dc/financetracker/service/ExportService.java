package practice.dc.financetracker.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;
import practice.dc.financetracker.entity.Transaction;
import practice.dc.financetracker.repository.TransactionRepository;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    private final TransactionRepository transactionRepository;

    public ExportService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public byte[] exportToCsv(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             CSVWriter writer = new CSVWriter(new OutputStreamWriter(baos))) {

            // Header
            writer.writeNext(new String[]{"Date", "Type", "Category", "Description", "Amount"});

            BigDecimal totalIncome = BigDecimal.ZERO;
            BigDecimal totalExpense = BigDecimal.ZERO;

            // Data rows
            for (Transaction t : transactions) {
                writer.writeNext(new String[]{
                        t.getDate().format(DateTimeFormatter.ISO_LOCAL_DATE),
                        t.getType().name(),
                        t.getCategory(),
                        t.getDescription() != null ? t.getDescription() : "",
                        t.getAmount().toPlainString()
                });

                if (t.getType() == Transaction.TransactionType.INCOME) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else {
                    totalExpense = totalExpense.add(t.getAmount());
                }
            }

            // Summary
            writer.writeNext(new String[]{});
            writer.writeNext(new String[]{"", "", "", "Total Income:", totalIncome.toPlainString()});
            writer.writeNext(new String[]{"", "", "", "Total Expenses:", totalExpense.toPlainString()});
            writer.writeNext(new String[]{"", "", "", "Net Balance:", totalIncome.subtract(totalExpense).toPlainString()});

            writer.flush();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV", e);
        }
    }

    public byte[] exportToPdf(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(26, 26, 46));
            Paragraph title = new Paragraph("Personal Finance Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Date range subtitle
            Font subtitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL, new Color(100, 100, 100));
            Paragraph dateRange = new Paragraph(
                    "Period: " + startDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
                            + " — " + endDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
                    subtitleFont
            );
            dateRange.setAlignment(Element.ALIGN_CENTER);
            dateRange.setSpacingAfter(20);
            document.add(dateRange);

            // Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 1.5f, 2f, 3f, 2f});

            // Header row
            Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD, Color.WHITE);
            String[] headers = {"Date", "Type", "Category", "Description", "Amount"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new Color(26, 26, 46));
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Data rows
            Font dataFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.BLACK);
            BigDecimal totalIncome = BigDecimal.ZERO;
            BigDecimal totalExpense = BigDecimal.ZERO;
            boolean alternate = false;

            for (Transaction t : transactions) {
                Color bgColor = alternate ? new Color(245, 245, 250) : Color.WHITE;
                alternate = !alternate;

                addCell(table, t.getDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")), dataFont, bgColor);
                addCell(table, t.getType().name(), dataFont, bgColor);
                addCell(table, t.getCategory(), dataFont, bgColor);
                addCell(table, t.getDescription() != null ? t.getDescription() : "-", dataFont, bgColor);

                Font amountFont = new Font(Font.HELVETICA, 10, Font.BOLD,
                        t.getType() == Transaction.TransactionType.INCOME ? new Color(0, 150, 0) : new Color(200, 0, 0));
                String prefix = t.getType() == Transaction.TransactionType.INCOME ? "+$" : "-$";
                addCell(table, prefix + t.getAmount().toPlainString(), amountFont, bgColor);

                if (t.getType() == Transaction.TransactionType.INCOME) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else {
                    totalExpense = totalExpense.add(t.getAmount());
                }
            }

            document.add(table);

            // Summary section
            document.add(new Paragraph("\n"));
            Font summaryFont = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(26, 26, 46));
            document.add(new Paragraph("Summary", summaryFont));
            document.add(new Paragraph("\n"));

            Font labelFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.DARK_GRAY);
            Font valueFont = new Font(Font.HELVETICA, 11, Font.BOLD, Color.BLACK);

            document.add(new Paragraph("Total Income: $" + totalIncome.toPlainString(), labelFont));
            document.add(new Paragraph("Total Expenses: $" + totalExpense.toPlainString(), labelFont));

            BigDecimal net = totalIncome.subtract(totalExpense);
            Font netFont = new Font(Font.HELVETICA, 13, Font.BOLD,
                    net.compareTo(BigDecimal.ZERO) >= 0 ? new Color(0, 150, 0) : new Color(200, 0, 0));
            document.add(new Paragraph("Net Balance: $" + net.toPlainString(), netFont));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void addCell(PdfPTable table, String text, Font font, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }
}
