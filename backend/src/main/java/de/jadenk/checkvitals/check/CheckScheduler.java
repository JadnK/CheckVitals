package de.jadenk.checkvitals.check;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CheckScheduler {

    private final CheckService checkService;

    public CheckScheduler(CheckService checkService) {
        this.checkService = checkService;
    }

    @Scheduled(
            fixedRateString = "${checkvitals.check.interval-ms:300000}",
            initialDelayString = "${checkvitals.check.initial-delay-ms:10000}"
    )
    public void runChecks() {
        System.out.println("Running scheduled uptime checks...");
        checkService.checkAllMonitors();
    }
}