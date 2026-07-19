import React, { useEffect, useState } from 'react';
import { Server } from 'lucide-react';

const providers = [
  {
    name: "VidCore",
    getMovieUrl: (id) => `https://vidcore.net/movie/${id}?theme=F05454`,
    getTvUrl: (id, s, e) => `https://vidcore.net/tv/${id}/${s}/${e}?theme=F05454`
  },
  {
    name: "Videasy",
    getMovieUrl: (id) => `https://player.videasy.to/movie/${id}`,
    getTvUrl: (id, s, e) => `https://player.videasy.to/tv/${id}/${s}/${e}`
  }, {
    name: "Peachify",
    getMovieUrl: (id) => `https://peachify.top/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://peachify.top/embed/tv/${id}/${s}/${e}`
  },
  {
    name: "VidFast",
    getMovieUrl: (id) => `https://vidfast.vc/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}`
  },
  {
    name: "Vidsrc",
    getMovieUrl: (id) => `https://vidsrc.sbs${id}&tmdb=1`,
    getTvUrl: (id, s, e) => `https://vidsrc.sbs=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    name: "flixcdn",
    getMovieUrl: (id) => `https://flixcdn.cyou/movie/${id}`,
    getTvUrl: (id, s, e) => `https://flixcdn.cyou/tv/${id}/${s}/${e}`
  },
  {
    name: "CloudOrchestraNova",
    getMovieUrl: (id) => `https://cloudorchestranova.com/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://cloudorchestranova.com/embed/tv/${id}/${s}/${e}`
  }
];

const VideoPlayer = ({ tmdbId, type = "movie", season = 1, episode = 1 }) => {
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);

  const selectedProvider = providers[selectedProviderIndex];

  const embedUrl = type === "movie"
    ? selectedProvider.getMovieUrl(tmdbId)
    : selectedProvider.getTvUrl(tmdbId, season, episode);

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
    <div className="flex flex-col gap-5 w-full">
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)]">
        <iframe
          key={embedUrl}
          src={embedUrl}
          width="100%"
          height="100%"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen={true}
          webkitAllowFullScreen={true}
          mozAllowFullScreen={true}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="origin"
          scrolling="no"
        ></iframe>
      </div>

      {/* Provider Selection UI */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-2 rounded-2xl w-fit mx-auto backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-[var(--color-moviesh-text-muted)] px-3 font-medium">
          <Server size={16} />
          <span>Server:</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {providers.map((provider, index) => {
            const isActive = selectedProviderIndex === index;
            return (
              <button
                key={provider.name}
                onClick={() => setSelectedProviderIndex(index)}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out outline-none
                  ${isActive
                    ? 'text-white bg-[var(--color-moviesh-accent)] shadow-[0_0_15px_rgba(240,84,84,0.3)]'
                    : 'text-[var(--color-moviesh-text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                  }
                  active:scale-[0.97]
                `}
              >
                {provider.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
