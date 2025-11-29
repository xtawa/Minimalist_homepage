import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Attempt to locate the photos directory.
    // In local dev, it might be in 'photos' or 'public/photos'.
    // In Vercel deployment, files are often served statically, but to list them via FS 
    // we need to find where the build output placed them or look at the project root.
    const possiblePaths = [
      path.join((process as any).cwd(), 'photos'),
      path.join((process as any).cwd(), 'public', 'photos'),
    ];

    let photoFiles: string[] = [];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        photoFiles = fs.readdirSync(p).filter(file => /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(file));
        if (photoFiles.length > 0) break;
      }
    }

    res.status(200).json(photoFiles);
  } catch (error) {
    console.error("Error reading photos directory:", error);
    // Return empty array instead of error to fail gracefully on frontend
    res.status(200).json([]);
  }
}