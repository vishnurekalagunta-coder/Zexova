package com.marketnest.service;

import com.marketnest.dto.AuthRequest;
import com.marketnest.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest.Login request);
    AuthResponse register(AuthRequest.Register request);
}

