package com.example.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.project.dto.UpdateUserDTO;
import com.example.project.dto.userDTO;
import com.example.project.model.User;
import com.example.project.repository.UserRepo;
import com.example.project.security.JwtUtil;
import com.example.project.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
	
	@Autowired
	private UserService userService;
	
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepo repo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

	
	 @PostMapping("/create")
	 public User createUser(@RequestBody userDTO userDTO) {
	     return userService.createUser(userDTO);
	 }
	 
	 @GetMapping("/hello")
	 public String hello() {
	     return "Hello, World!";
	 }
	 
	 @PostMapping("/login")
	    public  String login(@RequestParam String username, @RequestParam String password) {
	        try {
	            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
	            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
		        String token = jwtUtil.generateToken(userDetails.getUsername());
		        return token;
	        } catch (BadCredentialsException e) {
	             return "ERROR: Invalid username or password";
	        }   
	    }

	    @GetMapping("/getToken")
	    public ResponseEntity<String> getToken(@RequestParam String username) {
	        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	        String token = jwtUtil.generateToken(userDetails.getUsername());
	        return ResponseEntity.ok(token);
	    }

	    @PatchMapping("/edit")
	    public ResponseEntity<?> updateUser(
	            @AuthenticationPrincipal UserDetails userDetails,
	            @RequestBody UpdateUserDTO updatedData) {

	        
	    	User iser = userService.updateUser(userDetails.getUsername(), updatedData);
	    	return ResponseEntity.ok(iser);
	    }




	    @GetMapping("/getUser")
	    public ResponseEntity<User> getUser(Authentication authentication) {
	        String username = authentication.getName(); // ✅ Extracted from JWT token
	        User user = userService.getUserByUsername(new userDTO(username, null, null));

	        if (user != null) {
	            return ResponseEntity.ok(user);
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        }
	    }

	    @DeleteMapping("/delete")
	    public ResponseEntity<String> deleteUserByUsername(Authentication auth) {
	        String username = auth.getName(); // from JWT

	        User user = userService.getUserByUsername(new userDTO(username, null, null));

	        if (user != null) {
	            userService.deleteUserbyUsername(new userDTO(username, null, null));
	            return ResponseEntity.ok("User deleted successfully");
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }
	    }

	  
	
}
