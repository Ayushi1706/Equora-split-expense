package org.spring.equorabackend.Repository;

import org.spring.equorabackend.Model.Expense;
import org.spring.equorabackend.Model.ExpenseSplit;
import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, UUID> {
    void deleteByExpense(Expense expense);

    List<ExpenseSplit> findByUserAndExpense_Group(User user, Group group);

    List<ExpenseSplit> findByUser(User user);
}
