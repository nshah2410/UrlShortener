package com.neel.urlshortener.exception;

public class SlugAlreadyExistsException extends RuntimeException {
	public SlugAlreadyExistsException(String slug) {
		super("Short link '" + slug + "' is already taken");
	}
}
