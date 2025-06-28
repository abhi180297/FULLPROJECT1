package com.example.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.project.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

	User findByUsername(String username);
	Optional<User> findById(Long id);
	/*
	 * User findByEmail(String email);
	 * 
	 * boolean existsByEmail(String email);
	 * 
	 * boolean existsByName(String name);
	 */
	// Additional query methods can be defined here if needed
	
	// Example: List<User> findByNameContaining(String name);
	// Example: List<User> findByEmailContaining(String email);
	// Example: List<User> findByNameAndEmail(String name, String email);		

}
