package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.DashboardResponse;
import org.spring.equorabackend.Service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{userId}")
    public DashboardResponse getUserDashboard(@PathVariable UUID userId){
        return dashboardService.getUserDashboard(userId);
    }
}
