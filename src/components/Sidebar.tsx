import { Home, Compass, Clock, ThumbsUp, PlaySquare, Download, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const mainItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Explore" },
    { icon: PlaySquare, label: "Shorts" },
    { icon: Clock, label: "Subscriptions" },
  ];

  const libraryItems = [
    { icon: History, label: "History" },
    { icon: PlaySquare, label: "Your videos" },
    { icon: Clock, label: "Watch later" },
    { icon: ThumbsUp, label: "Liked videos" },
    { icon: Download, label: "Downloads" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background border-r border-border h-screen sticky top-16">
      <div className="p-3 space-y-1">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start gap-6 h-10 px-3"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Library Section */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Library</h3>
          {libraryItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-6 h-10 px-3"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Settings */}
        <Button variant="ghost" className="w-full justify-start gap-6 h-10 px-3">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;