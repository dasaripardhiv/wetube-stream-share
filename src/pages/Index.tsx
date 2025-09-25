import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import thumbnail1 from "@/assets/thumbnail-1.jpg";
import thumbnail2 from "@/assets/thumbnail-2.jpg";
import thumbnail3 from "@/assets/thumbnail-3.jpg";

const Index = () => {
  // Sample video data
  const videos = [
    {
      id: 1,
      title: "Stunning Mountain Lake Sunset - 4K Nature Documentary",
      channel: "Nature Explorer",
      views: "2.1M",
      timestamp: "2 days ago",
      duration: "15:42",
      thumbnail: thumbnail1,
    },
    {
      id: 2,
      title: "City Lights at Night - Urban Photography Tutorial",
      channel: "Photo Masters",
      views: "847K",
      timestamp: "1 week ago",
      duration: "12:18",
      thumbnail: thumbnail2,
    },
    {
      id: 3,
      title: "Perfect Coffee Brewing Guide - Barista Secrets",
      channel: "Coffee Culture",
      views: "1.3M",
      timestamp: "3 days ago",
      duration: "8:45",
      thumbnail: thumbnail3,
    },
    {
      id: 4,
      title: "Amazing Mountain Lake Reflections in 4K",
      channel: "Scenic Views",
      views: "3.2M",
      timestamp: "5 days ago",
      duration: "22:15",
      thumbnail: thumbnail1,
    },
    {
      id: 5,
      title: "Neon Cityscape Photography - Night Shots",
      channel: "Urban Lens",
      views: "692K",
      timestamp: "1 week ago",
      duration: "14:33",
      thumbnail: thumbnail2,
    },
    {
      id: 6,
      title: "Coffee Shop Ambiance - Perfect Study Music",
      channel: "Calm Sounds",
      views: "5.7M",
      timestamp: "2 weeks ago",
      duration: "1:00:00",
      thumbnail: thumbnail3,
    },
    {
      id: 7,
      title: "Sunrise Over Mountain Lake - Time Lapse",
      channel: "Time Lapse World",
      views: "1.8M",
      timestamp: "4 days ago",
      duration: "6:22",
      thumbnail: thumbnail1,
    },
    {
      id: 8,
      title: "Street Photography in Urban Environment",
      channel: "Street Photo Pro",
      views: "924K",
      timestamp: "6 days ago",
      duration: "18:07",
      thumbnail: thumbnail2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                channel={video.channel}
                views={video.views}
                timestamp={video.timestamp}
                duration={video.duration}
                thumbnail={video.thumbnail}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;