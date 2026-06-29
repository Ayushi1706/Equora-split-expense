package org.spring.equorabackend.Repository;

import org.spring.equorabackend.Model.Expense;

import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID>  {

    List<Expense> findByGroup(Group group);

    List<Expense> findByGroupAndPaidBy(Group group, User user);

    List<Expense> findByPaidBy(User user);
}
