package de.jadenk.checkvitals.monitor;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "monitors")
public class Monitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 500)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MonitorStatus currentStatus = MonitorStatus.UNKNOWN;

    private Long lastResponseTimeMs;

    private LocalDateTime lastCheckedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Monitor() {

    }

    public Monitor(String name, String url) {
        this.name = name;
        this.url = url;
        this.currentStatus = MonitorStatus.UNKNOWN;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (currentStatus == null) {
            currentStatus = MonitorStatus.UNKNOWN;
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

    public MonitorStatus getCurrentStatus() {
        return currentStatus;
    }

    public Long getLastResponseTimeMs() {
        return lastResponseTimeMs;
    }

    public LocalDateTime getLastCheckedAt() {
        return lastCheckedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setCurrentStatus(MonitorStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    public void setLastResponseTimeMs(Long lastResponseTimeMs) {
        this.lastResponseTimeMs = lastResponseTimeMs;
    }

    public void setLastCheckedAt(LocalDateTime lastCheckedAt) {
        this.lastCheckedAt = lastCheckedAt;
    }
}
