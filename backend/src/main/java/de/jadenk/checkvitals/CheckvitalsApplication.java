package de.jadenk.checkvitals;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CheckvitalsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CheckvitalsApplication.class, args);
	}

}
