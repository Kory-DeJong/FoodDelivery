package com.feastfinder.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    @Value("${security.jwt.secret:ZmVhc3RmaW5kZXItZGVmYXVsdC1zZWNyZXQtM2Y1YzBhYmU=}")
    private String secret;

    @Value("${security.jwt.expirationMs:86400000}")
    private long expirationMs;

    public String generateToken(String userId, String username, String role) {
        return Jwts.builder()
                .setSubject(userId)
                .addClaims(Map.of("username", username, "role", role))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

