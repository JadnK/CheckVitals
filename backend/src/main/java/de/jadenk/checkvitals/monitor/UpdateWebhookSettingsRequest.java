package de.jadenk.checkvitals.monitor;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateWebhookSettingsRequest(
        boolean webhookEnabled,

        @Size(max = 1000, message = "Webhook URL is too long")
        @Pattern(
                regexp = "^$|https://.*",
                message = "Webhook URL must be empty or start with https://"
        )
        String webhookUrl,

        boolean notifyOnOffline,
        boolean notifyOnLagging,
        boolean notifyOnOnline
) {
}