export function chunkCallback(
  byteLength: number,
  callback: (data: Buffer) => void
): (data: Buffer) => void {
  let buffer: Buffer | null = null;
  return data => {
    // Use the buffer if there was one
    if (buffer) {
      const neededBytes = byteLength - buffer.length;
      if (data.length >= neededBytes) {
        callback(Buffer.concat([buffer, data.slice(0, neededBytes)]));
        buffer = null;
        data = data.slice(neededBytes);
      } else {
        buffer = Buffer.concat([buffer, data]);
        return;
      }
    }

    // Pull out chunks of messages
    let idx;
    for (idx = 0; idx <= data.length - byteLength; idx += byteLength) {
      callback(data.slice(idx, idx + byteLength));
    }

    // Buffer anything that is left
    if (idx < data.length) {
      buffer = data.slice(idx);
    }
  };
}
