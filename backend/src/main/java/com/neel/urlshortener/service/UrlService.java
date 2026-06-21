package com.neel.urlshortener.service;

import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.repository.UrlRepository;
import com.neel.urlshortener.util.Base62Encoder;

@Service
public class UrlService {

	private final UrlRepository urlRepository;

	public UrlService(UrlRepository urlRepository) {
		this.urlRepository = urlRepository;
	}

	@Transactional
	public UrlMapping shortenUrl(String originalUrl) {
		if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
			originalUrl = "https://" + originalUrl;
		}

		Optional<UrlMapping> existing = urlRepository.findByOriginalUrl(originalUrl);
		if (existing.isPresent()) {
			return existing.get();
		}

		UrlMapping mapping = new UrlMapping();
		mapping.setOriginalUrl(originalUrl);
		String shortCode;
	    do {
	        shortCode = RandomStringUtils.randomAlphanumeric(8);
	        mapping.setShortCode(shortCode);
	    } while (urlRepository.findByShortCode(shortCode).isPresent());
		mapping = urlRepository.save(mapping);

		shortCode = Base62Encoder.encode(mapping.getId());
		mapping.setShortCode(shortCode);

		return urlRepository.save(mapping);
	}

	@Transactional
	public String getOriginalUrl(String shortCode) {
	    return urlRepository.findByShortCode(shortCode).map(mapping -> {
	        mapping.setClickCount(mapping.getClickCount() + 1);
	        urlRepository.save(mapping);
	        return mapping.getOriginalUrl();
	    }).orElse(null);
	}
}
