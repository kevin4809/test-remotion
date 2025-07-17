import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

const execAsync = promisify(exec);

// Try to import ffmpeg-static, fallback if not available
let ffmpegPath: string | undefined;
let ffprobePath: string | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ffmpegPath = require('ffmpeg-static');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ffprobePath = require('ffprobe-static').path;
} catch {
  console.log('FFmpeg static binaries not available, will use system binaries');
}

const RenderRequest = z.object({
  title: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = RenderRequest.parse(body);

    console.log('Starting video render with title:', title);

    // Create temporary directory for output
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, `video-${Date.now()}.mp4`);
    const inputPropsPath = path.join(tempDir, `props-${Date.now()}.json`);
    
    console.log('Output path:', outputPath);
    console.log('Props path:', inputPropsPath);
    
    // Create input props file
    await fs.writeFile(inputPropsPath, JSON.stringify({ title }));

    // Use Remotion CLI with better configuration for serverless
    const remotionCommand = [
      'npx',
      'remotion',
      'render',
      'src/remotion/index.ts',
      'MyComp',
      `"${outputPath}"`,
      `--props="${inputPropsPath}"`,
      '--image-format=jpeg',
      '--pixel-format=yuv420p',
      '--codec=h264',
      '--overwrite',
      '--log=info'
    ].join(' ');
    
    console.log('Executing command:', remotionCommand);
    console.log('Working directory:', process.cwd());
    
    // Set environment variables for better compatibility
    const env = {
      ...process.env,
      NODE_ENV: 'production' as const,
      // Set FFmpeg paths if available
      ...(ffmpegPath && { FFMPEG_PATH: ffmpegPath }),
      ...(ffprobePath && { FFPROBE_PATH: ffprobePath }),
    };
    
    const { stdout, stderr } = await execAsync(remotionCommand, {
      timeout: 280000, // 4.6 minutes (slightly less than Vercel's 5-minute limit)
      env,
      cwd: process.cwd(),
    });
    
    console.log('Remotion stdout:', stdout);
    if (stderr) console.log('Remotion stderr:', stderr);

    // Verify the file exists
    try {
      await fs.access(outputPath);
    } catch {
      throw new Error('Video file was not created successfully');
    }

    // Read the generated video file
    const videoBuffer = await fs.readFile(outputPath);
    console.log('Video file read, size:', videoBuffer.length);

    // Clean up temporary files
    try {
      await fs.unlink(outputPath);
      await fs.unlink(inputPropsPath);
    } catch (cleanupError) {
      console.warn('Cleanup error:', cleanupError);
    }

    // Return the video as a downloadable file
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="video.mp4"',
        'Content-Length': videoBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json(
      { error: 'Failed to render video: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 