package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.UserBalance;
import org.spring.equorabackend.Model.DTO.UserGroupBalance;
import org.spring.equorabackend.Service.BalanceCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/balance")
@CrossOrigin
public class BalanceCalculationController {
    @Autowired
    private BalanceCalculationService balanceCalculationService;
    @GetMapping("/group/{groupId}")
    public List<UserBalance> getGroupBalances(@PathVariable UUID groupId){
        return balanceCalculationService.getGroupBalances(groupId);
    }

    @GetMapping("/user/{userId}")
    public List<UserGroupBalance> getUserBalanceSummary(@PathVariable UUID userId) {
        return balanceCalculationService.getUserBalanceSummary(userId);
    }
}
