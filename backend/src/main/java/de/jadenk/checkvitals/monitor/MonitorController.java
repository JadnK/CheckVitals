package de.jadenk.checkvitals.monitor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MonitorController {

    @GetMapping("/api/health")
    public String health() {
        return "UptimeWatch backend is running";
    }
}