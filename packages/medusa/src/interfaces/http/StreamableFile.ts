import { Readable } from 'stream';
import { types } from 'util';

export interface StreamableFileOptions {
  type?: string;
  disposition?: string;
}

export class StreamableFile {
  private readonly stream: Readable;

  constructor(buffer: Uint8Array, options?: StreamableFileOptions);
  constructor(readable: Readable, options?: StreamableFileOptions);
  constructor(
    bufferOrReadStream: Uint8Array | Readable,
    readonly options: StreamableFileOptions = {},
  ) {
    if (types.isUint8Array(bufferOrReadStream)) {
      this.stream = new Readable();
      this.stream.push(bufferOrReadStream);
      this.stream.push(null);
    } else if (bufferOrReadStream.pipe && typeof bufferOrReadStream.pipe === 'function') {
      this.stream = bufferOrReadStream;
    }
  }

  getStream(): Readable {
    return this.stream;
  }

  getHeaders() {
    const { type = 'application/octet-stream', disposition = null } =
      this.options;
    return { type, disposition };
  }
}