package de.jadenk.checkvitals.webhook;

import de.jadenk.checkvitals.monitor.Monitor;
import de.jadenk.checkvitals.monitor.MonitorStatus;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class WebhookService {

    private final HttpClient httpClient;

    public WebhookService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    public void sendStatusChange(Monitor monitor, MonitorStatus previousStatus, MonitorStatus newStatus) {
        if (!shouldSendWebhook(monitor, previousStatus, newStatus)) {
            return;
        }

        String payload = buildDiscordPayload(monitor, previousStatus, newStatus);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(monitor.getWebhookUrl()))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                System.out.println("Webhook failed for monitor " + monitor.getId() + ": HTTP " + response.statusCode());
            }
        } catch (Exception exception) {
            System.out.println("Webhook error for monitor " + monitor.getId() + ": " + exception.getMessage());
        }
    }

    private boolean shouldSendWebhook(Monitor monitor, MonitorStatus previousStatus, MonitorStatus newStatus) {
        if (!monitor.isWebhookEnabled()) {
            return false;
        }

        if (monitor.getWebhookUrl() == null || monitor.getWebhookUrl().isBlank()) {
            return false;
        }

        if (previousStatus == newStatus) {
            return false;
        }

        if (newStatus == MonitorStatus.OFFLINE) {
            return monitor.isNotifyOnOffline();
        }

        if (newStatus == MonitorStatus.LAGGING) {
            return monitor.isNotifyOnLagging();
        }

        if (newStatus == MonitorStatus.ONLINE) {
            return monitor.isNotifyOnOnline() && previousStatus != MonitorStatus.PENDING;
        }

        return false;
    }

    private String buildDiscordPayload(Monitor monitor, MonitorStatus previousStatus, MonitorStatus newStatus) {
        String emoji = switch (newStatus) {
            case ONLINE -> "✅";
            case LAGGING -> "⚠️";
            case OFFLINE -> "🚨";
            case PENDING -> "❔";
        };

        String title = emoji + " " + monitor.getName() + " is now " + newStatus;

        String responseTime = monitor.getLastResponseTimeMs() == null
                ? "unknown"
                : monitor.getLastResponseTimeMs() + "ms";

        String description = "Status changed from **" + previousStatus + "** to **" + newStatus + "**\\n"
                + "URL: " + monitor.getUrl() + "\\n"
                + "Response time: " + responseTime;

        int color = switch (newStatus) {
            case ONLINE -> 5763719;
            case LAGGING -> 16776960;
            case OFFLINE -> 15548997;
            case PENDING -> 9807270;
        };

        return """
                {
                  "username": "CheckVitals",
                  "embeds": [
                    {
                      "title": "%s",
                      "description": "%s",
                      "color": %d
                    }
                  ]
                }
                """.formatted(
                escapeJson(title),
                escapeJson(description),
                color
        );
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }
}