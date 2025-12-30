package com.neel.urlshortener.service;

import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.repository.UrlRepository;
import com.neel.urlshortener.util.Base62Encoder;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UrlService {

	@Autowired
	private UrlRepository urlRepository;

	@Transactional
	public String shortenUrl(String originalUrl) {
		if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
			originalUrl = "https://" + originalUrl;
		}

		Optional<UrlMapping> existing = urlRepository.findByOriginalUrl(originalUrl);
		if (existing.isPresent()) {
			return existing.get().getShortCode();
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

		urlRepository.save(mapping);

		return shortCode;
	}

	@Transactional
	public String getOriginalUrl(String shortCode) {
	    return urlRepository.findByShortCode(shortCode).map(mapping -> {
	        mapping.setClickCount(mapping.getClickCount() + 1);
	        return mapping.getOriginalUrl();
	    }).orElse(null);
	}
}
