package com.neel.urlshortener.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class Base62EncoderTest {

	@Test
	void encodeZeroReturnsSingleZeroNotEmpty() {
		// Guard against the empty-string edge case for id 0.
		assertThat(Base62Encoder.encode(0)).isEqualTo("0");
	}

	@Test
	void encodesSmallIdsToExpectedSymbols() {
		// The alphabet is 0-9 a-z A-Z, so single digits map directly.
		assertThat(Base62Encoder.encode(1)).isEqualTo("1");
		assertThat(Base62Encoder.encode(9)).isEqualTo("9");
		assertThat(Base62Encoder.encode(10)).isEqualTo("a");
		assertThat(Base62Encoder.encode(35)).isEqualTo("z");
		assertThat(Base62Encoder.encode(36)).isEqualTo("A");
		assertThat(Base62Encoder.encode(61)).isEqualTo("Z");
	}

	@Test
	void rollsOverToTwoCharactersAt62() {
		assertThat(Base62Encoder.encode(62)).isEqualTo("10");
	}

	@Test
	void encodedValueNeverContainsSlashOrWhitespace() {
		// Short codes are used as URL path segments, so they must stay
		// in the [0-9a-zA-Z] set with no reserved characters.
		for (long id = 0; id < 1000; id++) {
			assertThat(Base62Encoder.encode(id)).matches("[0-9a-zA-Z]+");
		}
	}

	@ParameterizedTest
	@ValueSource(longs = { 0L, 1L, 9L, 10L, 61L, 62L, 1234L, 999_999L, Long.MAX_VALUE })
	void encodeThenDecodeReturnsOriginal(long id) {
		String code = Base62Encoder.encode(id);
		assertThat(Base62Encoder.decode(code)).isEqualTo(id);
	}

	@Test
	void decodeIsInverseOfEncodeAcrossARange() {
		for (long id = 0; id < 5000; id++) {
			assertThat(Base62Encoder.decode(Base62Encoder.encode(id))).isEqualTo(id);
		}
	}
}
