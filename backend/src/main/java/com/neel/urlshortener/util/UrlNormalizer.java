package com.neel.urlshortener.util;

import java.net.URI;

public final class UrlNormalizer {

	private UrlNormalizer() {
	}

	/** Prepend https:// when no protocol is present. */
	public static String withProtocol(String url) {
		String trimmed = url.trim();
		if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
			return "https://" + trimmed;
		}
		return trimmed;
	}

	/** Derive a human title from the URL host (www. stripped); fall back to "New link". */
	public static String titleFromUrl(String url) {
		try {
			String host = URI.create(withProtocol(url)).getHost();
			if (host != null && !host.isBlank()) {
				return host.replaceFirst("^www\\.", "");
			}
		} catch (IllegalArgumentException ignored) {
			// malformed URL — fall through to default
		}
		return "New link";
	}
}
