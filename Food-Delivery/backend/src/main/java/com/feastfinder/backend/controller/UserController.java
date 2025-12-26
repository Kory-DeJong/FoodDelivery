package com.feastfinder.backend.controller;

import com.feastfinder.backend.model.Address;
import com.feastfinder.backend.model.UserAccount;
import com.feastfinder.backend.repository.AddressRepository;
import com.feastfinder.backend.repository.UserRepository;
import com.feastfinder.backend.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public UserController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> listAddresses(Authentication auth) {
        String userId = ((UserPrincipal) auth.getPrincipal()).id();
        return ResponseEntity.ok(addressRepository.findByUser_IdOrderByIsDefaultDesc(userId));
    }

    @PostMapping("/addresses")
    public ResponseEntity<Address> addAddress(@RequestBody Map<String, String> req, Authentication auth) {
        String userId = ((UserPrincipal) auth.getPrincipal()).id();
        UserAccount user = userRepository.findById(userId).orElseThrow();
        Address a = new Address();
        a.setId(UUID.randomUUID().toString());
        a.setUser(user);
        a.setLabel(req.getOrDefault("label", "Home"));
        a.setLine1(req.get("line1"));
        a.setLine2(req.getOrDefault("line2", ""));
        a.setCity(req.get("city"));
        a.setPostalCode(req.get("postalCode"));
        a.setCountry(req.getOrDefault("country", ""));
        a.setDefault(Boolean.parseBoolean(req.getOrDefault("isDefault", "false")));
        if (a.isDefault()) {
            // unset previous defaults
            addressRepository.findByUser_IdOrderByIsDefaultDesc(userId).forEach(addr -> { addr.setDefault(false); addressRepository.save(addr); });
        }
        return ResponseEntity.ok(addressRepository.save(a));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable String id, Authentication auth) {
        String userId = ((UserPrincipal) auth.getPrincipal()).id();
        return addressRepository.findById(id).filter(a -> a.getUser().getId().equals(userId))
                .map(a -> { addressRepository.delete(a); return ResponseEntity.noContent().build(); })
                .orElse(ResponseEntity.notFound().build());
    }
}

