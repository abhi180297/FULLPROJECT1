package com.example.project.service;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.project.dto.userDTO;
import com.example.project.model.User;
import com.example.project.repository.UserRepo;



@Service
public class UserService {

	@Autowired
	private UserRepo userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public User createUser(userDTO userDTO) {
		
		User user1 = new User();
        user1.setUsername(userDTO.getUsername());
        user1.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user1.setEmail(userDTO.getEmail());
        return userRepository.save(user1);
	}
	 public User updateUser(userDTO userDTO) {
	        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByUsername(userDTO.getUsername()));
	        if (optionalUser.isPresent()) {
	            User user = optionalUser.get();
	            user.setEmail(userDTO.getEmail());
	            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
	            return userRepository.save(user);
	        } else {
	            throw new RuntimeException("User not found with username: " + userDTO.getUsername());
	        }
	    }

	    public User getUserByUsername(userDTO userDTO) {
	        return Optional.ofNullable(userRepository.findByUsername(userDTO.getUsername()))
	                .orElseThrow(() -> new RuntimeException("User not found with username: " + userDTO.getUsername()));
	    }

	    public void deleteUserbyUsername(userDTO userDTO) {
	        User user = userRepository.findByUsername(userDTO.getUsername());
	        if (user != null) {
	            userRepository.delete(user);
	        } else {
	            throw new RuntimeException("User not found with username: " + userDTO.getUsername());
	        }
	    }
	

	


	
}
