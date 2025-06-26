package com.example.project.model;

import jakarta.persistence.*;

@Entity
public class User {
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public User() {
		super();
	}
	public User(Long id, String username, String email, String password) {
		super();
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String username;
	private String email;	
	private String password;
	
}
