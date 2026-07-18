package com.neel.urlshortener.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.neel.urlshortener.dto.AnalyticsResponse;
import com.neel.urlshortener.dto.UpdateUrlRequest;
import com.neel.urlshortener.dto.UrlRequest;
import com.neel.urlshortener.dto.UrlResponse;
import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.service.AnalyticsService;
import com.neel.urlshortener.service.UrlService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class UrlController {

	private final UrlService urlService;
	private final AnalyticsService analyticsService;
	private final String baseUrl;

	public UrlController(UrlService urlService, AnalyticsService analyticsService,
			@Value("${app.base-url}") String baseUrl) {
		this.urlService = urlService;
		this.analyticsService = analyticsService;
		this.baseUrl = baseUrl;
	}

	@PostMapping("/api/urls")
	public ResponseEntity<?> createShortUrl(@RequestBody UrlRequest request) {
		if (request.getUrl() == null || request.getUrl().isBlank()) {
			return ResponseEntity.badRequest().body("URL cannot be empty");
		}
		UrlMapping mapping = urlService.shortenUrl(request.getUrl(), request.getSlug());
		return ResponseEntity.ok(UrlResponse.from(mapping, baseUrl));
	}

	@GetMapping("/api/urls")
	public List<UrlResponse> listUrls() {
		return urlService.listAll().stream()
				.map(m -> UrlResponse.from(m, baseUrl))
				.toList();
	}

	@GetMapping("/api/urls/{id}")
	public UrlResponse getUrl(@PathVariable Long id) {
		return UrlResponse.from(urlService.getById(id), baseUrl);
	}

	@PatchMapping("/api/urls/{id}")
	public UrlResponse updateUrl(@PathVariable Long id, @RequestBody UpdateUrlRequest request) {
		return UrlResponse.from(urlService.update(id, request), baseUrl);
	}

	@DeleteMapping("/api/urls/{id}")
	public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
		urlService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/api/urls/{id}/analytics")
	public AnalyticsResponse analytics(@PathVariable Long id) {
		urlService.getById(id); // 404 if the link does not exist
		return analyticsService.forLink(id);
	}

	@GetMapping("/{shortCode}")
	public ResponseEntity<String> redirect(@PathVariable String shortCode, HttpServletRequest request) {
		String originalUrl = urlService.resolveAndRecordClick(
				shortCode,
				request.getHeader("Referer"),
				request.getHeader("User-Agent"));

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
