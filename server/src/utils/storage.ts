import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { config } from '../config';

export interface StorageProvider {
  save(filename: string, buffer: Buffer, mimetype: string): Promise<{ url: string; thumbnailUrl?: string; width?: number; height?: number }>;
  delete(url: string): Promise<void>;
}

class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(config.uploadDir);
    this.ensureDir('images');
    this.ensureDir('thumbnails');
    this.ensureDir('files');
  }

  private async ensureDir(subdir: string) {
    const dir = path.join(this.uploadDir, subdir);
    try { await fs.mkdir(dir, { recursive: true }); } catch {}
  }

  async save(filename: string, buffer: Buffer, mimetype: string) {
    const ext = path.extname(filename) || '.bin';
    const id = uuidv4();
    const safeName = `${id}${ext}`;

    const isImage = mimetype.startsWith('image/');
    const subdir = isImage ? 'images' : 'files';
    const filePath = path.join(this.uploadDir, subdir, safeName);
    await fs.writeFile(filePath, buffer);

    let thumbnailUrl: string | undefined;
    let width: number | undefined;
    let height: number | undefined;

    if (isImage) {
      try {
        const metadata = await sharp(buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        if (width && width > 300) {
          const thumbName = `thumb_${safeName}`;
          const thumbPath = path.join(this.uploadDir, 'thumbnails', thumbName);
          await sharp(buffer)
            .resize(300, undefined, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbPath);
          thumbnailUrl = `/uploads/thumbnails/${thumbName}`;
        }
      } catch {}
    }

    return {
      url: `/uploads/${subdir}/${safeName}`,
      thumbnailUrl,
      width,
      height,
    };
  }

  async delete(url: string) {
    const filePath = path.join(this.uploadDir, url.replace('/uploads/', ''));
    try { await fs.unlink(filePath); } catch {}
    const thumbPath = path.join(this.uploadDir, 'thumbnails', `thumb_${path.basename(url)}`);
    try { await fs.unlink(thumbPath); } catch {}
  }
}

let storageInstance: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!storageInstance) {
    storageInstance = new LocalStorageProvider();
  }
  return storageInstance;
}
