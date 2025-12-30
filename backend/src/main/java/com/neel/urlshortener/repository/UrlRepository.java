package com.neel.urlshortener.repository;

import com.neel.urlshortener.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<UrlMapping, Long> {
    Optional<UrlMapping> findByShortCode(String shortCode);
    Optional<UrlMapping> findByOriginalUrl(String originalUrl);

}
