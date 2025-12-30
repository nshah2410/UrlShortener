package com.neel.urlshortener.util;

public class Base62Encoder {
	private static final String BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	public static String encode(long num) {
		if (num == 0)
			return "0";

		StringBuilder sb = new StringBuilder();
		while (num > 0) {
			int rem = (int) (num % 62);
			sb.append(BASE62.charAt(rem));
			num /= 62;
		}
		return sb.reverse().toString();
	}

	public static long decode(String str) {
		long num = 0;
		for (int i = 0; i < str.length(); i++) {
			num = num * 62 + BASE62.indexOf(str.charAt(i));
		}
		return num;
	}
}
