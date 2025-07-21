import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get('url');
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'URL del video requerida' }, { status: 400 });
    }

    // Validar que la URL es de AWS S3 (por seguridad)
    if (!videoUrl.includes('amazonaws.com') && !videoUrl.includes('s3.')) {
      return NextResponse.json({ error: 'URL no válida' }, { status: 400 });
    }

    // Descargar el video desde S3
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const videoBuffer = await response.arrayBuffer();
    
    // Devolver el video con headers apropiados
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="mi-video.mp4"',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Error al descargar video:', error);
    return NextResponse.json(
      { error: 'Error al descargar el video' }, 
      { status: 500 }
    );
  }
}

// Manejar preflight requests para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 