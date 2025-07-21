import React, { useState } from "react";
import { State } from "../helpers/use-rendering";
import { Button } from "./Button/Button";
import { Spacing } from "./Spacing";

const dropdown: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
};

const dropdownContent: React.CSSProperties = {
  display: "none",
  position: "absolute",
  backgroundColor: "var(--background)",
  minWidth: "160px",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  zIndex: 1,
  borderRadius: "var(--geist-border-radius)",
  border: "1px solid var(--border)",
  bottom: "100%",
  left: "0",
  marginBottom: "5px",
};

const dropdownContentShow: React.CSSProperties = {
  ...dropdownContent,
  display: "block",
};

const shareLink: React.CSSProperties = {
  color: "var(--foreground)",
  padding: "12px 16px",
  textDecoration: "none",
  display: "block",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

const shareIcon: React.CSSProperties = {
  width: "16px",
  height: "16px",
  marginRight: "8px",
  verticalAlign: "middle",
};

const ShareIcon: React.FC = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"
        fill="currentColor"
      />
    </svg>
  );
};

export const ShareButton: React.FC<{
  state: State;
}> = ({ state }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (state.status === "rendering") {
    return <Button disabled>Compartir video</Button>;
  }

  if (state.status !== "done") {
    throw new Error("Share button should not be rendered when not done");
  }

  // Opción 1: Web Share API (nativo)
  const handleNativeShare = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        // Para compartir el archivo directamente
        const response = await fetch(state.url);
        const blob = await response.blob();
        const file = new File([blob], "video.mp4", { type: "video/mp4" });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "¡Mira este video que he creado!",
            text: "Video creado con nuestra aplicación",
            files: [file]
          });
          return;
        }
      } catch (error) {
        console.log("Error al compartir archivo:", error);
      }
      
      // Fallback: compartir URL
      try {
        await navigator.share({
          title: "¡Mira este video que he creado!",
          text: "Video creado con nuestra aplicación",
          url: state.url
        });
        return;
      } catch (error) {
        console.log("Error al compartir URL:", error);
      }
    }
    
    // Si no hay soporte nativo, mostrar dropdown
    setShowDropdown(!showDropdown);
  };

  // Opción 2: URLs tradicionales de redes sociales
  const shareOptions = [
    {
      name: "Copiar enlace",
      action: () => {
        navigator.clipboard.writeText(state.url);
        alert("Enlace copiado al portapapeles");
        setShowDropdown(false);
      },
      icon: (
        <svg style={shareIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      ),
    },
    {
      name: "Descargar y compartir",
      action: () => {
        const link = document.createElement('a');
        link.href = state.url;
        link.download = 'video.mp4';
        link.click();
        setShowDropdown(false);
      },
      icon: (
        <svg style={shareIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      action: () => {
        const text = encodeURIComponent("¡Mira este video que he creado! Descárgalo aquí:");
        const url = `https://wa.me/?text=${text}%20${encodeURIComponent(state.url)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setShowDropdown(false);
      },
      icon: (
        <svg style={shareIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={dropdown}>
      <Button
        onClick={handleNativeShare}
        secondary
      >
        <ShareIcon />
        <Spacing />
        Compartir
      </Button>
      {showDropdown && (
        <div style={dropdownContentShow}>
          {shareOptions.map((option) => (
            <a
              key={option.name}
              style={shareLink}
              onClick={(e) => {
                e.preventDefault();
                option.action();
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "var(--accents-2)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "transparent";
              }}
              href="#"
            >
              {option.icon}
              {option.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}; 