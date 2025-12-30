package com.feastfinder.backend.bootstrap;

import com.feastfinder.backend.model.UserAccount;
import com.feastfinder.backend.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.annotation.PostConstruct;
import java.util.UUID;

@Component
public class DataSeeder {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.feastfinder.backend.repository.DiscountCodeRepository discountRepo;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder, com.feastfinder.backend.repository.DiscountCodeRepository discountRepo) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.discountRepo = discountRepo;
    }

    @PostConstruct
    public void seed() {
        // Seed a demo user for quick start
        userRepository.findByUsername("demo").or(() -> userRepository.findByEmail("demo@demo.com")).ifPresentOrElse(
                u -> {},
                () -> {
                    UserAccount u = new UserAccount();
                    u.setId(UUID.randomUUID().toString());
                    u.setUsername("demo");
                    u.setEmail("demo@demo.com");
                    u.setPasswordHash(passwordEncoder.encode("Passw0rd!"));
                    u.setRole("ROLE_USER");
                    userRepository.save(u);
                }
        );

        // Seed admin
        userRepository.findByUsername("admin").or(() -> userRepository.findByEmail("admin@demo.com")).ifPresentOrElse(
                u -> {},
                () -> {
                    UserAccount u = new UserAccount();
                    u.setId(UUID.randomUUID().toString());
                    u.setUsername("admin");
                    u.setEmail("admin@demo.com");
                    u.setPasswordHash(passwordEncoder.encode("AdminPass1!"));
                    u.setRole("ROLE_ADMIN");
                    userRepository.save(u);
                }
        );

        // Seed discount codes
        if (!discountRepo.existsById("WELCOME10")) {
            var d = new com.feastfinder.backend.model.DiscountCode();
            d.setCode("WELCOME10"); d.setType(com.feastfinder.backend.model.DiscountCode.Type.PERCENT); d.setValue(10);
            discountRepo.save(d);
        }
        if (!discountRepo.existsById("FIVEOFF")) {
            var d = new com.feastfinder.backend.model.DiscountCode();
            d.setCode("FIVEOFF"); d.setType(com.feastfinder.backend.model.DiscountCode.Type.FLAT); d.setValue(5);
            discountRepo.save(d);
        }
    }
}
