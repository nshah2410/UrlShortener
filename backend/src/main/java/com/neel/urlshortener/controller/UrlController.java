package com.neel.urlshortener.controller;

import com.neel.urlshortener.dto.UrlRequest;
import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.repository.UrlRepository;
import com.neel.urlshortener.service.UrlService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UrlController {

	@Autowired
	private UrlService urlService;

	@Autowired
	private UrlRepository urlRepository;
	
	@PostMapping("/api/urls")
	public ResponseEntity<?> createShortUrl(@RequestBody UrlRequest request) {
	    if (request.getUrl() == null || request.getUrl().isBlank()) {
	        return ResponseEntity.badRequest().body("URL cannot be empty");
	    }

	    String shortCode = urlService.shortenUrl(request.getUrl());

	    UrlMapping mapping = urlRepository.findByShortCode(shortCode).get();

	    return ResponseEntity.ok(Map.of(
	        "originalUrl", mapping.getOriginalUrl(),
	        "shortCode", mapping.getShortCode(),
	        "shortUrl", "http://localhost:8080/" + mapping.getShortCode(),
	        "clickCount", mapping.getClickCount()
	    ));
	}


	@GetMapping("/{shortCode}")
	public ResponseEntity<String> redirect(@PathVariable String shortCode) {
		String originalUrl = urlService.getOriginalUrl(shortCode);

		if (originalUrl == null) {
			String html404 = """
					<html>
					    <head><title>404 Not Found</title></head>
					    <body style="text-align:center;margin-top:50px;">
					        <h1>404 - Short URL Not Found</h1>
					        <p>The URL you are trying to access does not exist.</p>
					        <a href="/">Go Home</a>
					    </body>
					</html>
					""";
			return ResponseEntity.status(404).body(html404);
		}

		return ResponseEntity.status(302).header("Location", originalUrl).build();
	}


	@GetMapping("/api/urls/health")
	public String health() {
		return "OK";
	}
}
