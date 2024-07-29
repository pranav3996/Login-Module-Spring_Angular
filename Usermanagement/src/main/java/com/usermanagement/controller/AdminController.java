package com.usermanagement.controller;

import com.usermanagement.dto.ReqRes;
import com.usermanagement.entity.Users;

import com.usermanagement.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserManagementService userManagementService;
    
    @PostMapping("/register")
    public ReqRes register(@RequestBody ReqRes registrationRequest) {
    	
    	 if (registrationRequest.getEmail() == null || registrationRequest.getPassword() == null) {
             throw new RuntimeException("Email and password are required");
         }
        return userManagementService.registerAdmin(registrationRequest);
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers() {
        System.out.println("/admin/get-all-users"); // Log to verify endpoint access

        try {
            ReqRes response = userManagementService.getAllUsers();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching all users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new ReqRes());
        }
    }

    @GetMapping("/get-users/{userId}")
    public ResponseEntity<ReqRes> getUserById(@PathVariable Integer userId) {
//        return ResponseEntity.ok(userManagementService.getUsersById(userId));
        ReqRes response = userManagementService.getUsersById(userId);
        if (response == null) {
            throw new RuntimeException("User with ID " + userId + " not found");
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody Users reqres) {
//        return ResponseEntity.ok(userManagementService.updateUser(userId, reqres));
        ReqRes response = userManagementService.updateUser(userId, reqres);
        if (response == null) {
            throw new RuntimeException("User with ID " + userId + " not found");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = userManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
//        return ResponseEntity.ok(userManagementService.deleteUser(userId));
    	   ReqRes response = userManagementService.deleteUser(userId);
           if (response == null) {
               throw new RuntimeException("User with ID " + userId + " not found");
           }
           return ResponseEntity.ok(response);
    }

    // Other admin-related endpoints can be added here
}
