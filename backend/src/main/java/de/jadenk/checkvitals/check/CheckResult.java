package de.jadenk.checkvitals.check;

import de.jadenk.checkvitals.monitor.Monitor;
import de.jadenk.checkvitals.monitor.MonitorStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_results")
public class CheckResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "monitor_id")
    private Monitor monitor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MonitorStatus status;

    private Long responseTimeMs;

    @Column(length = 1000)
    private String errorMessage;

    @Column(nullable = false)
    private LocalDateTime checkedAt;

    public CheckResult() {
    }

    public CheckResult(Monitor monitor, MonitorStatus status, Long responseTimeMs, String errorMessage) {
        this.monitor = monitor;
        this.status = status;
        this.responseTimeMs = responseTimeMs;
        this.errorMessage = errorMessage;
        this.checkedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Monitor getMonitor() {
        return monitor;
    }

    public MonitorStatus getStatus() {
        return status;
    }

    public Long getResponseTimeMs() {
        return responseTimeMs;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }
}