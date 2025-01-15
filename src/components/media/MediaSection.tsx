import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Heart, MessageCircle, Reply, Upload } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface MediaItem {
  id: number;
  title: string;
  description: string;
  media_url: string;
  media_type: "image" | "video";
  created_at: string;
  user_id: string;
  likes: number;
  user_has_liked: boolean;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function MediaSection() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from("media")
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url),
          likes:media_likes(count),
          user_has_liked:media_likes!left(user_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedMedia = data?.map(item => ({
        ...item,
        likes: item.likes?.[0]?.count || 0,
        user_has_liked: item.user_has_liked?.some(like => like.user_id === user?.id) || false
      })) || [];

      setMediaItems(formattedMedia);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Media yüklənmədi",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Media əlavə etmək üçün daxil olmalısınız",
      });
      return;
    }

    if (!file || !title.trim()) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Başlıq və fayl seçilməlidir",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("media").insert({
        title: title.trim(),
        description: description.trim(),
        media_url: filePath,
        media_type: file.type.startsWith("image/") ? "image" : "video",
        user_id: user.id,
      });

      if (insertError) throw insertError;

      toast({
        title: "Uğurlu",
        description: "Media əlavə edildi",
      });

      setTitle("");
      setDescription("");
      setFile(null);
      fetchMediaItems();
    } catch (error) {
      console.error("Error uploading:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Media əlavə edilmədi",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (mediaId: number, isLiked: boolean) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Like etmək üçün daxil olmalısınız",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from("media_likes")
          .delete()
          .eq("media_id", mediaId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("media_likes")
          .insert({
            media_id: mediaId,
            user_id: user.id,
          });
      }

      fetchMediaItems();
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Əməliyyat uğursuz oldu",
      });
    }
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Mediamız</h2>

      {user && (
        <Card className="mb-8">
          <form onSubmit={handleUpload}>
            <CardHeader>
              <h3 className="text-2xl font-semibold">Yeni media əlavə et</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Başlıq"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
              <Textarea
                placeholder="Açıqlama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
              />
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  "Yüklənir..."
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Əlavə et
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={item.user?.avatar_url || undefined} />
                <AvatarFallback>
                  {item.user?.first_name?.[0] || ""}
                  {item.user?.last_name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">
                  {item.user?.first_name && item.user?.last_name
                    ? `${item.user.first_name} ${item.user.last_name}`
                    : "Naməlum istifadəçi"}
                </h4>
                <p className="text-sm text-gray-500">
                  {format(new Date(item.created_at), "dd.MM.yyyy HH:mm")}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              {item.media_type === "image" ? (
                <img
                  src={`${supabase.storage.from("media").getPublicUrl(item.media_url).data.publicUrl}`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <video
                  src={`${supabase.storage.from("media").getPublicUrl(item.media_url).data.publicUrl}`}
                  controls
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <p className="text-gray-600">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant={item.user_has_liked ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => handleLike(item.id, item.user_has_liked)}
              >
                <Heart className={`w-4 h-4 ${item.user_has_liked ? "fill-current" : ""}`} />
                <span>{item.likes}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Rəy yaz</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}