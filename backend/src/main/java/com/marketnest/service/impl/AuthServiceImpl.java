package com.marketnest.service.impl;

import com.marketnest.dto.AuthRequest;
import com.marketnest.dto.AuthResponse;
import com.marketnest.entity.User;
import com.marketnest.repository.UserRepository;
import com.marketnest.security.JwtTokenProvider;
import com.marketnest.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(AuthRequest.Login request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(token, user);
    }

    @Override
    public AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                request.getPhone(),
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        );

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());

        return new AuthResponse(token, savedUser);
    }
}

