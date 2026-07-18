package com.neel.urlshortener.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import com.neel.urlshortener.dto.UpdateUrlRequest;
import com.neel.urlshortener.exception.NotFoundException;
import com.neel.urlshortener.exception.SlugAlreadyExistsException;
import com.neel.urlshortener.model.UrlMapping;
import com.neel.urlshortener.repository.ClickEventRepository;
import com.neel.urlshortener.repository.UrlRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
class UrlServiceTest {

	@Autowired
	private UrlRepository urlRepository;

	@Autowired
	private ClickEventRepository clickEventRepository;

	@PersistenceContext
	private EntityManager entityManager;

	private UrlService urlService;

	@BeforeEach
	void setUp() {
		urlService = new UrlService(urlRepository, clickEventRepository);
	}

	@Test
	void shortenUrlPersistsMappingWithBase62CodeAndTitle() {
		UrlMapping mapping = urlService.shortenUrl("https://example.com/page");

		assertThat(mapping.getId()).isNotNull();
		assertThat(mapping.getShortCode()).matches("[0-9a-zA-Z]+");
		assertThat(mapping.getOriginalUrl()).isEqualTo("https://example.com/page");
		assertThat(mapping.getTitle()).isEqualTo("example.com");
		assertThat(urlRepository.findByShortCode(mapping.getShortCode())).isPresent();
	}

	@Test
	void shortenUrlStripsWwwFromTitle() {
		UrlMapping mapping = urlService.shortenUrl("https://www.github.com/a");
		assertThat(mapping.getTitle()).isEqualTo("github.com");
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
	void shortenUrlHonorsCustomSlug() {
		UrlMapping mapping = urlService.shortenUrl("https://custom.test/x", "My-Cool-Link");
		// Sanitized to lowercase [a-z0-9-].
		assertThat(mapping.getShortCode()).isEqualTo("my-cool-link");
	}

	@Test
	void shortenUrlRejectsDuplicateCustomSlug() {
		urlService.shortenUrl("https://first.test", "taken");
		assertThatExceptionOfType(SlugAlreadyExistsException.class)
				.isThrownBy(() -> urlService.shortenUrl("https://second.test", "taken"));
	}

	@Test
	void resolveAndRecordClickIncrementsCountAndStoresEvent() {
		UrlMapping mapping = urlService.shortenUrl("https://clicks.test/x");
		String code = mapping.getShortCode();
		Long id = mapping.getId();

		entityManager.flush();
		entityManager.clear();

		String dest = urlService.resolveAndRecordClick(code, "https://twitter.com/post",
				"Mozilla/5.0 (iPhone) Mobile Safari");
		assertThat(dest).isEqualTo("https://clicks.test/x");

		entityManager.flush();
		entityManager.clear();
		assertThat(urlRepository.findById(id)).get()
				.extracting(UrlMapping::getClickCount)
				.isEqualTo(1L);
		assertThat(clickEventRepository.findByUrlMappingId(id))
				.singleElement()
				.satisfies(e -> {
					assertThat(e.getReferrer()).isEqualTo("twitter.com");
					assertThat(e.getDevice()).isEqualTo("Mobile");
					assertThat(e.getBrowser()).isEqualTo("Safari");
				});
	}

	@Test
	void resolveAndRecordClickReturnsNullForUnknownCode() {
		assertThat(urlService.resolveAndRecordClick("nope", null, null)).isNull();
	}

	@Test
	void listAllReturnsNewestFirst() {
		UrlMapping a = urlService.shortenUrl("https://a.test");
		UrlMapping b = urlService.shortenUrl("https://b.test");
		assertThat(urlService.listAll())
				.extracting(UrlMapping::getId)
				.containsExactly(b.getId(), a.getId());
	}

	@Test
	void deleteRemovesLinkAndItsClickEvents() {
		UrlMapping mapping = urlService.shortenUrl("https://del.test");
		urlService.resolveAndRecordClick(mapping.getShortCode(), null, null);
		Long id = mapping.getId();

		urlService.delete(id);

		assertThat(urlRepository.findById(id)).isEmpty();
		assertThat(clickEventRepository.findByUrlMappingId(id)).isEmpty();
	}

	@Test
	void deleteUnknownIdThrowsNotFound() {
		assertThatExceptionOfType(NotFoundException.class)
				.isThrownBy(() -> urlService.delete(99999L));
	}

	@Test
	void updateChangesDestinationSlugAndTitle() {
		UrlMapping mapping = urlService.shortenUrl("https://old.test");
		UpdateUrlRequest req = new UpdateUrlRequest();
		req.setOriginalUrl("https://new.test/path");
		req.setSlug("new-slug");
		req.setTitle("New Title");

		UrlMapping updated = urlService.update(mapping.getId(), req);

		assertThat(updated.getOriginalUrl()).isEqualTo("https://new.test/path");
		assertThat(updated.getShortCode()).isEqualTo("new-slug");
		assertThat(updated.getTitle()).isEqualTo("New Title");
	}

	@Test
	void updateRejectsSlugTakenByAnotherLink() {
		urlService.shortenUrl("https://one.test", "reserved");
		UrlMapping other = urlService.shortenUrl("https://two.test");
		UpdateUrlRequest req = new UpdateUrlRequest();
		req.setSlug("reserved");

		assertThatExceptionOfType(SlugAlreadyExistsException.class)
				.isThrownBy(() -> urlService.update(other.getId(), req));
	}
}
