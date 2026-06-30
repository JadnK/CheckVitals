package de.jadenk.checkvitals.check;

import de.jadenk.checkvitals.monitor.Monitor;
import de.jadenk.checkvitals.monitor.MonitorRepository;
import de.jadenk.checkvitals.monitor.MonitorStatus;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CheckService {

    private final MonitorRepository monitorRepository;
    private final CheckResultRepository checkResultRepository;
    private final HttpClient httpClient;

    public CheckService(MonitorRepository monitorRepository, CheckResultRepository checkResultRepository) {
        this.monitorRepository = monitorRepository;
        this.checkResultRepository = checkResultRepository;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public void checkAllMonitors() {
        List<Monitor> monitors = monitorRepository.findAll();

        for (Monitor monitor : monitors) {
            try {
                checkMonitor(monitor);
            } catch (Exception exception) {
                System.out.println("Failed to check monitor " + monitor.getId() + ": " + exception.getMessage());
            }
        }
    }

    public CheckResult checkMonitor(Monitor monitor) {
        long startTime = System.nanoTime();

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(monitor.getUrl()))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());

            long responseTimeMs = (System.nanoTime() - startTime) / 1_000_000;
            int statusCode = response.statusCode();

            MonitorStatus status = statusCode >= 200 && statusCode < 400
                    ? MonitorStatus.ONLINE
                    : MonitorStatus.OFFLINE;

            String errorMessage = status == MonitorStatus.ONLINE
                    ? null
                    : "HTTP status code: " + statusCode;

            monitor.setCurrentStatus(status);
            monitor.setLastResponseTimeMs(responseTimeMs);
            monitor.setLastCheckedAt(LocalDateTime.now());
            monitorRepository.save(monitor);

            CheckResult result = new CheckResult(monitor, status, responseTimeMs, errorMessage);
            return checkResultRepository.save(result);

        } catch (Exception exception) {
            long responseTimeMs = (System.nanoTime() - startTime) / 1_000_000;

            monitor.setCurrentStatus(MonitorStatus.OFFLINE);
            monitor.setLastResponseTimeMs(responseTimeMs);
            monitor.setLastCheckedAt(LocalDateTime.now());
            monitorRepository.save(monitor);

            CheckResult result = new CheckResult(
                    monitor,
                    MonitorStatus.OFFLINE,
                    responseTimeMs,
                    exception.getMessage()
            );

            return checkResultRepository.save(result);
        }
    }
}