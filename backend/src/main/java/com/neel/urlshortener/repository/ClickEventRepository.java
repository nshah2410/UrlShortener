package com.neel.urlshortener.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neel.urlshortener.model.ClickEvent;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
	List<ClickEvent> findByUrlMappingId(Long urlMappingId);
	long countByUrlMappingId(Long urlMappingId);
}
