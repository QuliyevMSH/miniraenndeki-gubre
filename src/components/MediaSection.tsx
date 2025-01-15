import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";

interface Media {
  id: number;
  title: string | null;
  description: string | null;
  url: string;
  type: string;
  created_at: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const MediaSection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: mediaItems, refetch } = useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*, user:profiles(first_name, last_name, avatar_url)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Media[];
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa fayl seçin",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("İstifadəçi tapılmadı");

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      // Save media info to database
      const { error: dbError } = await supabase.from("media").insert([
        {
          title,
          description,
          url: publicUrl.publicUrl,
          type: file.type.startsWith("image/") ? "image" : "video",
          user_id: user.data.user.id,
        },
      ]);

      if (dbError) throw dbError;

      toast({
        title: "Uğurlu",
        description: "Media əlavə edildi",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      refetch();
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Xəta",
        description: "Media əlavə edilmədi",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Mediamız</h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12 space-y-4">
        <Input
          type="text"
          placeholder="Başlıq"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Açıqlama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? "Yüklənir..." : "Əlavə et"}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems?.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.title || ""}
                className="w-full h-48 object-cover"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              {item.title && (
                <h3 className="font-semibold text-lg">{item.title}</h3>
              )}
              {item.description && (
                <p className="text-muted-foreground">{item.description}</p>
              )}
              <div className="text-sm text-muted-foreground">
                {item.user?.first_name && item.user?.last_name
                  ? `${item.user.first_name} ${item.user.last_name}`
                  : "Anonim istifadəçi"}{" "}
                tərəfindən{" "}
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                  locale: az,
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};