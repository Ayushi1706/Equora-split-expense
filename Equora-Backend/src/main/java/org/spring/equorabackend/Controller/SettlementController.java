package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.CreateSettlementRequest;
import org.spring.equorabackend.Model.Settlement;
import org.spring.equorabackend.Service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/api/settlement")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @PostMapping("")
    public Settlement createSettlement(@RequestBody CreateSettlementRequest Request){
        return settlementService.createSettlement(Request);
    }

    @GetMapping("/{settlementId}")
    public Settlement getSettlementById(@PathVariable UUID settlementId){
        return settlementService.getSettlementById(settlementId);
    }

    @GetMapping("/group/{groupId}")
    public List<Settlement> getSettlementsForGroup(@PathVariable UUID groupId){
        return settlementService.getSettlementsForGroup(groupId);
    }

    @PatchMapping("/{settlementId}/confirm")
    public ResponseEntity<Settlement> confirmSettlement(
            @PathVariable UUID settlementId) {

        Settlement settlement = settlementService.confirmSettlement(settlementId);
        return ResponseEntity.ok(settlement);
    }

    @DeleteMapping("/{settlementId}")
    public String deleteSettlement(@PathVariable UUID settlementId){
        return settlementService.deleteSettlement(settlementId);
    }
}
