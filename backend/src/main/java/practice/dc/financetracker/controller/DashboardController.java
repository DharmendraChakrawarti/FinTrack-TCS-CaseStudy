package practice.dc.financetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import practice.dc.financetracker.dto.DashboardResponse;
import practice.dc.financetracker.entity.User;
import practice.dc.financetracker.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getDashboard(user.getId()));
    }
}
