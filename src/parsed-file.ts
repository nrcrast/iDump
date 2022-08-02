const sanitize = require('sanitize-filename');
import * as path from 'path';
import * as mm from 'music-metadata';

export class ParsedFile {
    private sanitizedFileName: string;
    constructor(public file: string, public metadata?: mm.IAudioMetadata) {
        this.sanitizedFileName = this.buildSanitizedFileName();
    }

    public getNewFileName(): string {
        return this.sanitizedFileName;
    }

    private buildSanitizedFileName(): string {
        const artist =
        this.metadata?.common.artist ?? this.metadata?.common.albumartist;
      const album = this.metadata?.common.album ?? 'unknown_album';
      const title = this.metadata?.common.title;
  
      const hasTags = artist || album || title;
  
      const newFilename = hasTags
        ? `${artist}-${album}-${title}${path.extname(this.file)}`
        : this.file;
  
      return sanitize(newFilename);
    }
}