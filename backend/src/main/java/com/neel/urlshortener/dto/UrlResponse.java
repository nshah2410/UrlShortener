package com.neel.urlshortener.dto;

import java.time.LocalDateTime;

import com.neel.urlshortener.model.UrlMapping;

/**
 * API representation of a shortened URL. Mirrors the shape the frontend
 * consumes (id, originalUrl, shortCode, shortUrl, title, clickCount, createdAt).
 */
public class UrlResponse {

	private Long id;
	private String originalUrl;
	private String shortCode;
	private String shortUrl;
	private String title;
	private Long clickCount;
	private LocalDateTime createdAt;

	public UrlResponse() {
	}

	public static UrlResponse from(UrlMapping mapping, String baseUrl) {
		UrlResponse r = new UrlResponse();
		r.id = mapping.getId();
		r.originalUrl = mapping.getOriginalUrl();
		r.shortCode = mapping.getShortCode();
		r.shortUrl = baseUrl + "/" + mapping.getShortCode();
		r.title = mapping.getTitle();
		r.clickCount = mapping.getClickCount();
		r.createdAt = mapping.getCreatedAt();
		return r;
	}

	public Long getId() {
		return id;
	}

	public String getOriginalUrl() {
		return originalUrl;
	}

	public String getShortCode() {
		return shortCode;
	}

	public String getShortUrl() {
		return shortUrl;
	}

	public String getTitle() {
		return title;
	}

	public Long getClickCount() {
		return clickCount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
