"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Spacing } from '../../../components/Spacing';
import { getVideo, VideoData } from '../../../helpers/video-storage';

const container: React.CSSProperties = {
  maxWidth: 768,
  margin: "auto",
  marginBottom: 20,
  padding: 20,
};

const videoContainer: React.CSSProperties = {
  borderRadius: "var(--geist-border-radius)",
  overflow: "hidden",
  boxShadow: "0 0 200px rgba(0, 0, 0, 0.15)",
  marginBottom: 40,
  marginTop: 60,
  backgroundColor: "#000",
};

const video: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
};

const title: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center",
  marginBottom: "20px",
  color: "var(--foreground)",
};

const description: React.CSSProperties = {
  fontSize: "16px",
  textAlign: "center",
  color: "var(--accents-6)",
  marginBottom: "30px",
};

const downloadSection: React.CSSProperties = {
  textAlign: "center",
  marginTop: "30px",
};

const downloadButton: React.CSSProperties = {
  backgroundColor: "var(--geist-background)",
  color: "var(--geist-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "var(--geist-border-radius)",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  display: "inline-block",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const loading: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  color: "var(--accents-6)",
};

const errorStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  color: "var(--error)",
};



export default function VideoPage() {
  const params = useParams();
  const videoId = params?.id as string;
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    // Usar el helper para recuperar el video
    const video = getVideo(videoId);
    if (video) {
      setVideoData(video);
    } else {
      setError('Video no encontrado');
    }
    setIsLoading(false);
  }, [videoId]);

  if (isLoading) {
    return (
      <div style={container}>
        <div style={loading}>
          Cargando video...
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div style={container}>
        <div style={errorStyle}>
          {error || 'Video no encontrado'}
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    return Intl.NumberFormat("en", {
      notation: "compact",
      style: "unit",
      unit: "byte",
      unitDisplay: "narrow",
    }).format(bytes);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={container}>
             <Head>
         <title>{videoData.title || 'Tarjeta de Identificación'} - Mi App</title>
         <meta property="og:title" content={videoData.title || 'Tarjeta de Identificación'} />
         <meta property="og:description" content="Video creado con nuestra aplicación" />
         <meta property="og:url" content={`${window.location.origin}/video/${videoId}`} />
         <meta property="og:type" content="video.other" />
         <meta property="og:video" content={videoData.url} />
         <meta property="og:video:type" content="video/mp4" />
         <meta property="og:video:width" content="640" />
         <meta property="og:video:height" content="360" />
       </Head>
      <h1 style={title}>
        {videoData.title || 'Tarjeta de Identificación'}
      </h1>
      
      <p style={description}>
        Creado el {formatDate(videoData.createdAt)}
      </p>

      <div style={videoContainer}>
        <video 
          style={video}
          controls
          preload="metadata"
        >
          <source src={videoData.url} type="video/mp4" />
          Tu navegador no soporta la reproducción de videos HTML5.
        </video>
      </div>

      <div style={downloadSection}>
        <a 
          href={videoData.url}
          style={downloadButton}
        >
          Descargar Video ({formatFileSize(videoData.size)})
        </a>
      </div>

      <Spacing />
      <Spacing />
    </div>
  );
} 