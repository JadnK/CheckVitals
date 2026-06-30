package de.jadenk.checkvitals.monitor;

import de.jadenk.checkvitals.check.CheckResult;
import de.jadenk.checkvitals.check.CheckResultRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MonitorController {

    private final MonitorRepository monitorRepository;
    private final CheckResultRepository checkResultRepository;

    public MonitorController(MonitorRepository monitorRepository, CheckResultRepository checkResultRepository) {
        this.monitorRepository = monitorRepository;
        this.checkResultRepository = checkResultRepository;
    }

    @GetMapping("/health")
    public String health() {
        return "UptimeWatch backend is running";
    }

    @GetMapping("/monitors")
    public List<Monitor> getAllMonitors() {
        return monitorRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Monitor::getCreatedAt).reversed())
                .toList();
    }

    @PostMapping("/monitors")
    public ResponseEntity<Monitor> createMonitor(@Valid @RequestBody CreateMonitorRequest request) {
        Monitor monitor = new Monitor(request.name(), request.url());
        Monitor savedMonitor = monitorRepository.save(monitor);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedMonitor);
    }

    @GetMapping("/monitors/{id}")
    public ResponseEntity<Monitor> getMonitorById(@PathVariable Long id) {
        return monitorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/monitors/{id}")
    public ResponseEntity<Void> deleteMonitor(@PathVariable Long id) {
        if (!monitorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        checkResultRepository.deleteByMonitorId(id);
        monitorRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/monitors/{id}/checks")
    public ResponseEntity<List<CheckResult>> getMonitorChecks(@PathVariable Long id) {
        if (!monitorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        List<CheckResult> checks = checkResultRepository.findTop20ByMonitorIdOrderByCheckedAtDesc(id);
        return ResponseEntity.ok(checks);
    }
}