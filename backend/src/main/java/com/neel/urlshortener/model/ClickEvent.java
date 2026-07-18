package com.neel.urlshortener.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** One recorded visit to a short link, used to power analytics. */
@Entity
public class ClickEvent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long urlMappingId;

	private LocalDateTime clickedAt = LocalDateTime.now();

	private String referrer;
	private String device;
	private String browser;
	private String country;

	public ClickEvent() {
	}

	public ClickEvent(Long urlMappingId, String referrer, String device, String browser, String country) {
		this.urlMappingId = urlMappingId;
		this.referrer = referrer;
		this.device = device;
		this.browser = browser;
		this.country = country;
	}

	public Long getId() {
		return id;
	}

	public Long getUrlMappingId() {
		return urlMappingId;
	}

	public void setUrlMappingId(Long urlMappingId) {
		this.urlMappingId = urlMappingId;
	}

	public LocalDateTime getClickedAt() {
		return clickedAt;
	}

	public void setClickedAt(LocalDateTime clickedAt) {
		this.clickedAt = clickedAt;
	}

	public String getReferrer() {
		return referrer;
	}

	public void setReferrer(String referrer) {
		this.referrer = referrer;
	}

	public String getDevice() {
		return device;
	}

	public void setDevice(String device) {
		this.device = device;
	}

	public String getBrowser() {
		return browser;
	}

	public void setBrowser(String browser) {
		this.browser = browser;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
}
