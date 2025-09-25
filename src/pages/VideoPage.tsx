import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { formatDistanceToNow } from 'date-fns';

interface Video {
  id: string;
  title: string;
  description: string;
  channel_name: string;
  views: number;
  created_at: string;
  video_url: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface VideoStats {
  likes: number;
  dislikes: number;
  comments: number;
  userLike?: 'like' | 'dislike' | null;
}

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<VideoStats>({ likes: 0, dislikes: 0, comments: 0 });
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchVideo();
      fetchComments();
      fetchStats();
    }
  }, [id, user]);

  const fetchVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Video not found",
          variant: "destructive",
        });
        return;
      }

      setVideo(data);
      
      // Increment view count
      await supabase
        .from('videos')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', id)
        .order('created_at', { ascending: false });

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get like/dislike counts
      const { data: likesData } = await supabase
        .from('likes')
        .select('type')
        .eq('video_id', id);

      // Get comment count
      const { data: commentsData } = await supabase
        .from('comments')
        .select('id')
        .eq('video_id', id);

      // Get user's like status if authenticated
      let userLike = null;
      if (user) {
        const { data: userLikeData } = await supabase
          .from('likes')
          .select('type')
          .eq('video_id', id)
          .eq('user_id', user.id)
          .single();
        
        userLike = userLikeData?.type || null;
      }

      const likes = likesData?.filter(l => l.type === 'like').length || 0;
      const dislikes = likesData?.filter(l => l.type === 'dislike').length || 0;
      
      setStats({
        likes,
        dislikes,
        comments: commentsData?.length || 0,
        userLike
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLike = async (type: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like videos",
        variant: "destructive",
      });
      return;
    }

    try {
      if (stats.userLike === type) {
        // Remove like/dislike
        await supabase
          .from('likes')
          .delete()
          .eq('video_id', id)
          .eq('user_id', user.id);
      } else {
        // Add or update like/dislike
        await supabase
          .from('likes')
          .upsert({
            video_id: id,
            user_id: user.id,
            type
          });
      }

      fetchStats();
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      await supabase
        .from('comments')
        .insert({
          video_id: id,
          user_id: user.id,
          content: newComment.trim()
        });

      setNewComment('');
      fetchComments();
      fetchStats();
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Video link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={video.video_url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">{video.title}</h1>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                    {video.channel_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{video.channel_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.created_at))} ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={stats.userLike === 'like' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLike('like')}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {stats.likes}
                  </Button>
                  
                  <Button
                    variant={stats.userLike === 'dislike' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLike('dislike')}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    {stats.dislikes}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              {video.description && (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {video.description}
                  </p>
                </Card>
              )}
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {stats.comments} Comments
                </h2>
              </div>

              {/* Add Comment */}
              {user ? (
                <form onSubmit={handleComment} className="space-y-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={!newComment.trim()}>
                      Comment
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setNewComment('')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground mb-4">Sign in to leave a comment</p>
                  <Link to="/auth">
                    <Button>Sign In</Button>
                  </Link>
                </Card>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                          {comment.user_id?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              User {comment.user_id?.slice(0, 8) || 'Anonymous'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at))} ago
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{comment.content}</p>
                        </div>
                      </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Related Videos</h3>
            <div className="space-y-3">
              {/* Placeholder for related videos */}
              <p className="text-muted-foreground text-sm">Related videos coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;