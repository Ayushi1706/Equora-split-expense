package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.CreateExpenseRequest;
import org.spring.equorabackend.Model.Expense;
import org.spring.equorabackend.Service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expense")
@CrossOrigin
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @PostMapping("")
    public Expense createExpense(@RequestBody CreateExpenseRequest expense){
        return expenseService.createExpense(expense);
    }

    @GetMapping("/{expenseId}")
    public Expense getExpenseById(@PathVariable UUID expenseId){
        return expenseService.getExpenseById(expenseId);
    }

    @GetMapping("/group/{groupId}")
    public List<Expense> getExpensesForGroup(@PathVariable UUID groupId){
        return expenseService.getExpensesForGroup(groupId);
    }

    @PutMapping("/{expenseId}")
    public Expense updateExpense(
            @PathVariable UUID expenseId,
            @RequestBody CreateExpenseRequest request) {

        return expenseService.updateExpense(expenseId, request);
    }

    @DeleteMapping("/{expenseId}")
    public String deleteExpense(@PathVariable UUID expenseId){
        return expenseService.deleteExpense(expenseId);
    }
}
