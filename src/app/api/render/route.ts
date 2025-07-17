import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

const RenderRequest = z.object({
  title: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = RenderRequest.parse(body);

    // Create a temporary output path
    const outputPath = path.join(process.cwd(), 'temp-video.mp4');
    
    // Create a temporary input props file
    const inputPropsPath = path.join(process.cwd(), 'temp-props.json');
    await fs.writeFile(inputPropsPath, JSON.stringify({ title }));

    // Use Remotion CLI to render the video
    const command = `npx remotion render src/remotion/index.ts MyComp "${outputPath}" --props="${inputPropsPath}"`;
    
    console.log('Executing command:', command);
    const { stdout, stderr } = await execAsync(command);
    console.log('Remotion output:', stdout);
    if (stderr) console.log('Remotion stderr:', stderr);

    // Read the generated video file
    const videoBuffer = await fs.readFile(outputPath);

    // Clean up temporary files
    await fs.unlink(outputPath);
    await fs.unlink(inputPropsPath);

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