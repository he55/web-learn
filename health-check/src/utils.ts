const MAX_VARINT_BYTES = 5;

function decodeLength(buffer: Uint8Array, offset = 0) {
  const end = buffer.length;
  let result = 0;
  let shift = 0;
  let bytesRead = 0;

  for (let i = 0; i < MAX_VARINT_BYTES; i++) {
    const idx = offset + i;
    if (idx >= end) {
      throw new RangeError(
        "buffer ended before length varint was fully decoded"
      );
    }
    const byte = buffer[idx]!;
    bytesRead++;
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      return { length: result, bytesRead };
    }
    shift += 7;
  }
  // After reading 5 bytes, the continuation bit must be zero according to spec
  throw new RangeError("malformed varint: length uses more than 5 bytes");
}

export function decodeString(buffer: Buffer, offset = 0) {
  const { length, bytesRead: lenVarintBytes } = decodeLength(buffer, offset);
  const start = offset + lenVarintBytes;
  const end = start + length;
  if (end > buffer.length) {
    throw new RangeError("buffer ended before the string bytes were available");
  }
  const slice = buffer.subarray(start, end);
  return slice.toString("utf8");
}
