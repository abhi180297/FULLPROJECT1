package com.example.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project.model.AssetData;

public interface AssetDataRepository extends JpaRepository<AssetData, String> {
	// This interface will automatically provide CRUD operations for AssetData entities
	// No additional methods are needed unless specific queries are required
Optional<AssetData> findByMobileNumber(String mobno);
	  

}
