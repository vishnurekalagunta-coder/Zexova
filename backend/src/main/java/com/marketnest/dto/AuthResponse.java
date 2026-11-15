package com.marketnest.dto;

import com.marketnest.entity.User;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;

    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String avatarUrl;

        public UserDto() {}
        public UserDto(User u) {
            this.id = u.getId();
            this.name = u.getName();
            this.email = u.getEmail();
            this.role = u.getRole() != null ? u.getRole().name() : "CUSTOMER";
            this.phone = u.getPhone();
            this.avatarUrl = u.getAvatarUrl();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDto(user);
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}

