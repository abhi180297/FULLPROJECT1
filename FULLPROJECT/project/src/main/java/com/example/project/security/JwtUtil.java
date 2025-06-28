package com.example.project.security;

import java.util.Date;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


@Component
public class JwtUtil {
	private final String SECRET_KEY = "your_secret_key";
	private final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds
	
	public String generateToken(String username) {
		// Logic to generate JWT token using SECRET_KEY and EXPIRATION_TIME
		// This is a placeholder; actual implementation will depend on your JWT library
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + EXPIRATION_TIME))
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
		 
	}
	public String getUsernameFromToken(String token) {
		// Logic to extract username from JWT token
		// This is a placeholder; actual implementation will depend on your JWT library
		return Jwts.parser()
				.setSigningKey(SECRET_KEY)
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
	  private Claims extractAllClaims(String token) {
	        return Jwts.parser()
	                .setSigningKey(SECRET_KEY) // same key used to sign token
	                .parseClaimsJws(token)
	                .getBody();
	    }
	  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
	        final Claims claims = extractAllClaims(token);
	        return claimsResolver.apply(claims);
	    }
	  
	   public String extractUsername(String token) {
	        return extractClaim(token, Claims::getSubject);
	    }
	   
	public boolean validateToken(String token) {
		try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }		
	}
	  public Long extractUserId(String token) {
	        return Long.parseLong(extractAllClaims(token).get("id").toString());
	    }
}
