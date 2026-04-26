import React, { useEffect } from 'react';

const VideoPlayer = ({ tmdbId, type = "movie", season = 1, episode = 1 }) => {
  let embedUrl = type === "movie" 
    ? `https://player.videasy.net/movie/${tmdbId}`
    : `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`;

  // Deep red color scheme matching our minimalist style
  embedUrl += "?color=F05454";

  useEffect(() => {
    // Walkie-Talkie Listener for "Continue Watching" progress tracking
    const handleMessage = (event) => {
      if (typeof event.data !== "string") return;
      
      try {
        const playerEvent = JSON.parse(event.data);
        if (playerEvent.type === "PLAYER_EVENT" && playerEvent.data.event === "timeupdate") {
          const currentTime = playerEvent.data.currentTime;
          const movieId = playerEvent.data.id;
          
          localStorage.setItem(`movie_progress_${movieId}`, currentTime);
          // Optional: Only log every 10 seconds to avoid console spam, or keep it quiet
          // console.log(`Saved progress for movie ${movieId}: ${currentTime}s`);
        }
      } catch (error) {
        // Ignore messages that aren't valid JSON
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)]">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
