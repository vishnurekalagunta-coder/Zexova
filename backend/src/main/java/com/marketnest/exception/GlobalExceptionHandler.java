package com.marketnest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public static class ErrorResponse {
        private int status;
        private String message;
        private LocalDateTime timestamp = LocalDateTime.now();
        private Map<String, String> errors;

        public ErrorResponse(int status, String message) {
            this.status = status;
            this.message = message;
        }

        public ErrorResponse(int status, String message, Map<String, String> errors) {
            this.status = status;
            this.message = message;
            this.errors = errors;
        }

        public int getStatus() { return status; }
        public String getMessage() { return message; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public Map<String, String> getErrors() { return errors; }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        ErrorResponse err = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Validation Failed", errors);
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponse err = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Invalid email or password");
        return new ResponseEntity<>(err, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse err = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

