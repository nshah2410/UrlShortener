package com.neel.urlshortener.service;

import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neel.urlshortener.dto.UpdateUrlRequest;
import com.neel.urlshortener.exception.NotFoundException;
import com.neel.urlshortener.exception.SlugAlreadyExistsException;
import com.neel.urlshortener.model.ClickEvent;
import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.repository.ClickEventRepository;
import com.neel.urlshortener.repository.UrlRepository;
import com.neel.urlshortener.util.Base62Encoder;
import com.neel.urlshortener.util.UrlNormalizer;

@Service
public class UrlService {

	private final UrlRepository urlRepository;
	private final ClickEventRepository clickEventRepository;

	public UrlService(UrlRepository urlRepository, ClickEventRepository clickEventRepository) {
		this.urlRepository = urlRepository;
		this.clickEventRepository = clickEventRepository;
	}

	@Transactional
	public UrlMapping shortenUrl(String originalUrl, String requestedSlug) {
		String normalized = UrlNormalizer.withProtocol(originalUrl);

		// If a custom slug is requested, honor it (must be unique).
		String slug = sanitizeSlug(requestedSlug);
		if (slug != null) {
			if (urlRepository.existsByShortCode(slug)) {
				throw new SlugAlreadyExistsException(slug);
			}
			UrlMapping mapping = new UrlMapping();
			mapping.setOriginalUrl(normalized);
			mapping.setTitle(UrlNormalizer.titleFromUrl(normalized));
			mapping.setShortCode(slug);
			return urlRepository.save(mapping);
		}

		// No custom slug: reuse an existing mapping for the same URL if present.
		Optional<UrlMapping> existing = urlRepository.findByOriginalUrl(normalized);
		if (existing.isPresent()) {
			return existing.get();
		}

		UrlMapping mapping = new UrlMapping();
		mapping.setOriginalUrl(normalized);
		mapping.setTitle(UrlNormalizer.titleFromUrl(normalized));
		String placeholder;
		do {
			placeholder = RandomStringUtils.randomAlphanumeric(8);
			mapping.setShortCode(placeholder);
		} while (urlRepository.existsByShortCode(placeholder));
		mapping = urlRepository.save(mapping);

		mapping.setShortCode(Base62Encoder.encode(mapping.getId()));
		return urlRepository.save(mapping);
	}

	/** Backwards-compatible overload with no custom slug. */
	@Transactional
	public UrlMapping shortenUrl(String originalUrl) {
		return shortenUrl(originalUrl, null);
	}

	@Transactional(readOnly = true)
	public List<UrlMapping> listAll() {
		return urlRepository.findAllByOrderByCreatedAtDesc();
	}

	@Transactional(readOnly = true)
	public UrlMapping getById(Long id) {
		return urlRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Link " + id + " not found"));
	}

	@Transactional
	public void delete(Long id) {
		if (!urlRepository.existsById(id)) {
			throw new NotFoundException("Link " + id + " not found");
		}
		clickEventRepository.deleteAll(clickEventRepository.findByUrlMappingId(id));
		urlRepository.deleteById(id);
	}

	@Transactional
	public UrlMapping update(Long id, UpdateUrlRequest request) {
		UrlMapping mapping = getById(id);

		if (request.getOriginalUrl() != null && !request.getOriginalUrl().isBlank()) {
			mapping.setOriginalUrl(UrlNormalizer.withProtocol(request.getOriginalUrl()));
		}
		if (request.getTitle() != null && !request.getTitle().isBlank()) {
			mapping.setTitle(request.getTitle());
		}
		String slug = sanitizeSlug(request.getSlug());
		if (slug != null && !slug.equals(mapping.getShortCode())) {
			if (urlRepository.existsByShortCode(slug)) {
				throw new SlugAlreadyExistsException(slug);
			}
			mapping.setShortCode(slug);
		}
		return urlRepository.save(mapping);
	}

	/** Resolve a short code, record a click event, and bump the counter. */
	@Transactional
	public String resolveAndRecordClick(String shortCode, String referrer, String userAgent) {
		return urlRepository.findByShortCode(shortCode).map(mapping -> {
			mapping.setClickCount(mapping.getClickCount() + 1);
			urlRepository.save(mapping);
			clickEventRepository.save(new ClickEvent(
					mapping.getId(),
					normalizeReferrer(referrer),
					deviceFromUserAgent(userAgent),
					browserFromUserAgent(userAgent),
					null));
			return mapping.getOriginalUrl();
		}).orElse(null);
	}

	/** Sanitize a requested slug to [a-z0-9-]; return null when blank. */
	private String sanitizeSlug(String raw) {
		if (raw == null) {
			return null;
		}
		String cleaned = raw.trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
		return cleaned.isEmpty() ? null : cleaned;
	}

	private String normalizeReferrer(String referrer) {
		if (referrer == null || referrer.isBlank()) {
			return "Direct";
		}
		try {
			String host = java.net.URI.create(referrer).getHost();
			return host != null ? host.replaceFirst("^www\\.", "") : "Direct";
		} catch (IllegalArgumentException e) {
			return "Direct";
		}
	}

	private String deviceFromUserAgent(String ua) {
		if (ua == null) {
			return "Unknown";
		}
		String lower = ua.toLowerCase();
		if (lower.contains("mobile") || lower.contains("iphone") || lower.contains("android")) {
			return "Mobile";
		}
		if (lower.contains("ipad") || lower.contains("tablet")) {
			return "Tablet";
		}
		return "Desktop";
	}

	private String browserFromUserAgent(String ua) {
		if (ua == null) {
			return "Unknown";
		}
		String lower = ua.toLowerCase();
		if (lower.contains("edg")) {
			return "Edge";
		}
		if (lower.contains("chrome")) {
			return "Chrome";
		}
		if (lower.contains("firefox")) {
			return "Firefox";
		}
		if (lower.contains("safari")) {
			return "Safari";
		}
		return "Other";
	}
}
