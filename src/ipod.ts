import * as recursiveRead from 'recursive-readdir';
import * as path from 'path';
import * as mm from 'music-metadata';
import { ParsedFile } from './parsed-file';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

export class Ipod {
  constructor(private mountPoint: string) {}

  public async copyToFs(destination: string) {
    console.log(destination);

    const files = await this.getAudioFiles();

    await mkdirp(destination);

    for(let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const dest = path.join(destination, file.getNewFileName());
        console.log(`${i}/${files.length}: ${dest}`);
        await fs.promises.copyFile(file.file, dest);
    }
  }

  private async getMetadata(file: string): Promise<ParsedFile> {
    let metadata: mm.IAudioMetadata | null = null;
    try {
      metadata = await mm.parseFile(file);
    } catch (e) {
      metadata = null;
    }

    return new ParsedFile(file, metadata);
  }

  private async getAudioFiles(): Promise<ParsedFile[]> {
    const rawFiles = await recursiveRead(
      path.resolve(this.mountPoint, 'iPod_Control', 'Music'),
      ['*.vcf', '*.dat', '*.plist'],
    );

    const parsedFiles: ParsedFile[] = [];

    for (let i = 0; i < rawFiles.length; i += 1) {
      console.log(`Processing ${i}/${rawFiles.length}`);
      parsedFiles.push(await this.getMetadata(rawFiles[i]));
    }

    return parsedFiles;
  }
}
