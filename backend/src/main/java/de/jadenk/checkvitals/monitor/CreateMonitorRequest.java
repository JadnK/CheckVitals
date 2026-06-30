package de.jadenk.checkvitals.monitor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateMonitorRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name is too long")
        String name,

        @NotBlank(message = "URL is required")
        @Size(max = 500, message = "URL is too long")
        @Pattern(regexp = "https?://.*", message = "URL must start with http:// or https://")
        String url
) {
}