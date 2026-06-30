package de.jadenk.checkvitals.check;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckResultRepository extends JpaRepository<CheckResult, Long> {

    List<CheckResult> findTop20ByMonitorIdOrderByCheckedAtDesc(Long monitorId);

    @Transactional
    void deleteByMonitorId(Long monitorId);
}