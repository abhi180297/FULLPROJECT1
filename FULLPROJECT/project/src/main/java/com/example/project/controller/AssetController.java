/*
 * package com.example.project.controller;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.http.ResponseEntity; import
 * org.springframework.security.core.Authentication; import
 * org.springframework.web.bind.annotation.PostMapping; import
 * org.springframework.web.bind.annotation.RequestMapping; import
 * org.springframework.web.bind.annotation.RequestPart; import
 * org.springframework.web.bind.annotation.RestController; import
 * org.springframework.web.multipart.MultipartFile;
 * 
 * import com.example.project.service.AssetService;
 * 
 * @RestController
 * 
 * @RequestMapping("/assets") public class AssetController {
 * 
 * @Autowired private AssetService service;
 * 
 * @PostMapping(value = "/upload", consumes = {"multipart/form-data"}) public
 * ResponseEntity<?> upload(@RequestPart("file") MultipartFile file,
 * Authentication auth) { try { //if(auth.isAuthenticated()) {
 * 
 * service.save(file); return
 * ResponseEntity.ok("Excel uploaded and data saved successfully."); //}
 * //else{return (ResponseEntity<?>) ResponseEntity.badRequest();} } catch
 * (Exception e) { return ResponseEntity.badRequest().body("Upload failed: " +
 * e.getMessage()); } } }
 * 
 * 
 */