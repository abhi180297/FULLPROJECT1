package com.example.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public class UpdateUserDTO {
	private String email;
	private String password;
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
	public UpdateUserDTO(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}
	public UpdateUserDTO() {
		super();
	}
		
	
}
