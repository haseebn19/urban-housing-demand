package io.github.haseebn19.uhd.controllers;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Answers every failed request with the same JSON shape: timestamp, status, error, message. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
        // Spring MVC errors such as 404 for an unknown path or 405 for an unsupported method
        // carry their own status and are not server errors.
        if (ex instanceof ErrorResponse rejected) {
            logger.debug("Request rejected: {}", ex.getMessage());
            return errorResponse(rejected.getStatusCode(), rejected.getBody().getDetail());
        }

        logger.error("Unhandled exception", ex);
        return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    private static ResponseEntity<Map<String, Object>> errorResponse(
            HttpStatusCode status, String message) {
        HttpStatus knownStatus = HttpStatus.resolve(status.value());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", knownStatus != null ? knownStatus.getReasonPhrase() : "Error");
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
