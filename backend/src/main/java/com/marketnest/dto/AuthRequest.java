package com.marketnest.dto;

import com.marketnest.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {

    public static class Login {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;

        public Login() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class Register {
        @NotBlank
        private String name;

        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;

        private Role role = Role.CUSTOMER;
        private String phone;

        public Register() {}
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }
}

