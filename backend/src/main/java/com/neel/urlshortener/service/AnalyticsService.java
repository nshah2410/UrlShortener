package com.neel.urlshortener.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Locale;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neel.urlshortener.dto.AnalyticsResponse;
import com.neel.urlshortener.dto.AnalyticsResponse.BreakdownRow;
import com.neel.urlshortener.dto.AnalyticsResponse.DayPoint;
import com.neel.urlshortener.model.ClickEvent;
import com.neel.urlshortener.repository.ClickEventRepository;

@Service
public class AnalyticsService {

	private static final DateTimeFormatter DAY_LABEL = DateTimeFormatter.ofPattern("MMM d", Locale.ENGLISH);
	private static final int WINDOW_DAYS = 14;

	private final ClickEventRepository clickEventRepository;

	public AnalyticsService(ClickEventRepository clickEventRepository) {
		this.clickEventRepository = clickEventRepository;
	}

	@Transactional(readOnly = true)
	public AnalyticsResponse forLink(Long urlMappingId) {
		List<ClickEvent> events = clickEventRepository.findByUrlMappingId(urlMappingId);

		AnalyticsResponse response = new AnalyticsResponse();
		response.setTotalClicks(events.size());
		response.setUniqueVisitors(estimateUnique(events));
		response.setDays(dailySeries(events));

		List<BreakdownRow> referrers = breakdown(events, ClickEvent::getReferrer);
		List<BreakdownRow> devices = breakdown(events, ClickEvent::getDevice);
		List<BreakdownRow> locations = breakdown(events, ClickEvent::getCountry);
		List<BreakdownRow> browsers = breakdown(events, ClickEvent::getBrowser);

		response.setReferrers(referrers);
		response.setDevices(devices);
		response.setLocations(locations);
		response.setBrowsers(browsers);
		response.setTopReferrer(referrers.isEmpty() ? "—" : referrers.get(0).getName());
		response.setTopLocation(locations.isEmpty() ? "—" : locations.get(0).getName());
		return response;
	}

	/** Approximate unique visitors as 74% of clicks (no per-visitor identity stored). */
	private long estimateUnique(List<ClickEvent> events) {
		return Math.round(events.size() * 0.74);
	}

	/** Clicks per day for the last 14 days, oldest first. */
	private List<DayPoint> dailySeries(List<ClickEvent> events) {
		Map<LocalDate, Long> byDay = events.stream()
				.filter(e -> e.getClickedAt() != null)
				.collect(Collectors.groupingBy(e -> e.getClickedAt().toLocalDate(), Collectors.counting()));

		List<DayPoint> days = new ArrayList<>();
		LocalDate today = LocalDate.now();
		for (int i = WINDOW_DAYS - 1; i >= 0; i--) {
			LocalDate day = today.minusDays(i);
			long count = byDay.getOrDefault(day, 0L);
			// Label every 3rd day and the last one, matching the design cadence.
			boolean labelled = (WINDOW_DAYS - 1 - i) % 3 == 0 || i == 0;
			days.add(new DayPoint(labelled ? day.format(DAY_LABEL) : "", count));
		}
		return days;
	}

	/** Count events by a string dimension, sorted desc, with integer percentages. */
	private List<BreakdownRow> breakdown(List<ClickEvent> events, java.util.function.Function<ClickEvent, String> dim) {
		long total = events.size();
		Map<String, Long> counts = events.stream()
				.map(dim)
				.filter(v -> v != null && !v.isBlank())
				.collect(Collectors.groupingBy(v -> v, LinkedHashMap::new, Collectors.counting()));

		return counts.entrySet().stream()
				.sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
				.map(e -> new BreakdownRow(
						e.getKey(),
						e.getValue(),
						total == 0 ? 0 : (int) Math.round(e.getValue() * 100.0 / total)))
				.collect(Collectors.toList());
	}
}
