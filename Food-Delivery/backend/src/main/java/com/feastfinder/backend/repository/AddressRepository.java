package com.feastfinder.backend.repository;

import com.feastfinder.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUser_IdOrderByIsDefaultDesc(String userId);
}

