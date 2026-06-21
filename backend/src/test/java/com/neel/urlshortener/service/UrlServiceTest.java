package com.neel.urlshortener.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.repository.UrlRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
class UrlServiceTest {

	@Autowired
	private UrlRepository urlRepository;

	@PersistenceContext
	private EntityManager entityManager;

	private UrlService urlService;

	@BeforeEach
	void setUp() {
		urlService = new UrlService(urlRepository);
	}

	@Test
	void shortenUrlPersistsMappingWithBase62Code() {
		UrlMapping mapping = urlService.shortenUrl("https://example.com/page");

		assertThat(mapping.getId()).isNotNull();
		assertThat(mapping.getShortCode()).matches("[0-9a-zA-Z]+");
		assertThat(mapping.getOriginalUrl()).isEqualTo("https://example.com/page");
		assertThat(urlRepository.findByShortCode(mapping.getShortCode())).isPresent();
	}

	@Test
	void shortenUrlPrependsHttpsWhenProtocolMissing() {
		UrlMapping mapping = urlService.shortenUrl("example.com/no-protocol");
		assertThat(mapping.getOriginalUrl()).isEqualTo("https://example.com/no-protocol");
	}

	@Test
	void shortenUrlReusesExistingMappingForSameUrl() {
		UrlMapping first = urlService.shortenUrl("https://reuse.test/a");
		UrlMapping second = urlService.shortenUrl("https://reuse.test/a");
		assertThat(second.getId()).isEqualTo(first.getId());
		assertThat(second.getShortCode()).isEqualTo(first.getShortCode());
	}

	@Test
	void getOriginalUrlIncrementsAndPersistsClickCount() {
		UrlMapping mapping = urlService.shortenUrl("https://clicks.test/x");
		String code = mapping.getShortCode();
		Long id = mapping.getId();

		// Force the create to hit the DB, then detach so subsequent reads
		// come back from the database rather than the persistence context.
		entityManager.flush();
		entityManager.clear();

		String first = urlService.getOriginalUrl(code);
		assertThat(first).isEqualTo("https://clicks.test/x");

		entityManager.flush();
		entityManager.clear();
		assertThat(urlRepository.findById(id)).get()
				.extracting(UrlMapping::getClickCount)
				.isEqualTo(1L);

		urlService.getOriginalUrl(code);
		entityManager.flush();
		entityManager.clear();
		assertThat(urlRepository.findById(id)).get()
				.extracting(UrlMapping::getClickCount)
				.isEqualTo(2L);
	}

	@Test
	void getOriginalUrlReturnsNullForUnknownCode() {
		assertThat(urlService.getOriginalUrl("does-not-exist")).isNull();
	}
}
