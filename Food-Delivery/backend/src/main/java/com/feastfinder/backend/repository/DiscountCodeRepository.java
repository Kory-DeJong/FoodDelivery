package com.feastfinder.backend.repository;

import com.feastfinder.backend.model.DiscountCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountCodeRepository extends JpaRepository<DiscountCode, String> {}

