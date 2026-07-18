package com.neel.urlshortener.dto;

/** Fields editable via PATCH /api/urls/{id}. Null fields are left unchanged. */
public class UpdateUrlRequest {
	private String originalUrl;
	private String slug;
	private String title;

	public String getOriginalUrl() {
		return originalUrl;
	}

	public void setOriginalUrl(String originalUrl) {
		this.originalUrl = originalUrl;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
}
