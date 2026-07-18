package com.neel.urlshortener.dto;

import java.util.List;

/** Aggregated analytics for one short link, shaped for the Analytics screen. */
public class AnalyticsResponse {

	public static class DayPoint {
		private String label;
		private long value;

		public DayPoint(String label, long value) {
			this.label = label;
			this.value = value;
		}

		public String getLabel() {
			return label;
		}

		public long getValue() {
			return value;
		}
	}

	public static class BreakdownRow {
		private String name;
		private long value;
		private int percent;

		public BreakdownRow(String name, long value, int percent) {
			this.name = name;
			this.value = value;
			this.percent = percent;
		}

		public String getName() {
			return name;
		}

		public long getValue() {
			return value;
		}

		public int getPercent() {
			return percent;
		}
	}

	private long totalClicks;
	private long uniqueVisitors;
	private String topLocation;
	private String topReferrer;
	private List<DayPoint> days;
	private List<BreakdownRow> referrers;
	private List<BreakdownRow> devices;
	private List<BreakdownRow> locations;
	private List<BreakdownRow> browsers;

	public long getTotalClicks() {
		return totalClicks;
	}

	public void setTotalClicks(long totalClicks) {
		this.totalClicks = totalClicks;
	}

	public long getUniqueVisitors() {
		return uniqueVisitors;
	}

	public void setUniqueVisitors(long uniqueVisitors) {
		this.uniqueVisitors = uniqueVisitors;
	}

	public String getTopLocation() {
		return topLocation;
	}

	public void setTopLocation(String topLocation) {
		this.topLocation = topLocation;
	}

	public String getTopReferrer() {
		return topReferrer;
	}

	public void setTopReferrer(String topReferrer) {
		this.topReferrer = topReferrer;
	}

	public List<DayPoint> getDays() {
		return days;
	}

	public void setDays(List<DayPoint> days) {
		this.days = days;
	}

	public List<BreakdownRow> getReferrers() {
		return referrers;
	}

	public void setReferrers(List<BreakdownRow> referrers) {
		this.referrers = referrers;
	}

	public List<BreakdownRow> getDevices() {
		return devices;
	}

	public void setDevices(List<BreakdownRow> devices) {
		this.devices = devices;
	}

	public List<BreakdownRow> getLocations() {
		return locations;
	}

	public void setLocations(List<BreakdownRow> locations) {
		this.locations = locations;
	}

	public List<BreakdownRow> getBrowsers() {
		return browsers;
	}

	public void setBrowsers(List<BreakdownRow> browsers) {
		this.browsers = browsers;
	}
}
