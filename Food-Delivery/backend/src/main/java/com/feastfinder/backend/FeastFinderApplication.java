package com.feastfinder.backend;

import com.feastfinder.common.config.AppConfig;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import com.feastfinder.backend.cli.FeastFinderCLI;

@SpringBootApplication
@ComponentScan(basePackages = {"com.feastfinder"})
public class FeastFinderApplication {

    public static void main(String[] args) {
        // Initialize singleton configuration
        AppConfig config = AppConfig.getInstance();
        config.setAppName("FeastFinder");
        config.setAppVersion("1.0.0");
        config.setCurrencySymbol("$");
        
        SpringApplication.run(FeastFinderApplication.class, args);
        
        System.out.println("FeastFinder Application Started!");
        System.out.println("App Name: " + config.getAppName());
        System.out.println("Version: " + config.getAppVersion());
    }

    @Bean
    CommandLineRunner cliRunner(
            FeastFinderCLI cli,
            @Value("${cli.enabled:false}") boolean cliEnabled
    ) {
        return args -> {
            if (cliEnabled) {
                cli.run();
            }
        };
    }
}
