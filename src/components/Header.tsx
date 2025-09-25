import { Search, Menu, Video, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
              <Video className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="text-foreground">We</span>
              <span className="text-primary">Tube</span>
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
          <div className="flex w-full">
            <Input
              type="search"
              placeholder="Search videos..."
              className="rounded-r-none border-r-0 bg-input focus:bg-background transition-colors"
            />
            <Button variant="secondary" className="rounded-l-none px-6 border-l-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;