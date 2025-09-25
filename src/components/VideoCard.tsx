import { MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
  channelAvatar?: string;
}

const VideoCard = ({ 
  title, 
  channel, 
  views, 
  timestamp, 
  duration, 
  thumbnail,
  channelAvatar 
}: VideoCardProps) => {
  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-muted">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-primary overflow-hidden">
          {channelAvatar ? (
            <img src={channelAvatar} alt={channel} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
              {channel.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          
          <div className="mt-1 text-sm text-muted-foreground space-y-1">
            <p className="hover:text-foreground transition-colors cursor-pointer">
              {channel}
            </p>
            <div className="flex items-center gap-1">
              <span>{views} views</span>
              <span>•</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>

        {/* More options */}
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-8 h-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCard;