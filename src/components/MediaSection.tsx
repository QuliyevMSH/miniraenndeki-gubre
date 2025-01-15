import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Media } from '@/types/media';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MediaSection() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);

  const { data: mediaItems = [], refetch } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Media[];
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (type === 'image' && !selectedFile.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Zəhmət olmasa şəkil faylı seçin",
        });
        return;
      }
      if (type === 'video' && !selectedFile.type.startsWith('video/')) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Zəhmət olmasa video faylı seçin",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Paylaşım etmək üçün daxil olmalısınız",
      });
      return;
    }

    if (!file || !title.trim()) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Başlıq və fayl tələb olunur",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('media')
        .insert({
          title,
          description,
          url: publicUrl,
          type,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      setTitle('');
      setDescription('');
      setFile(null);
      refetch();
      toast({
        title: "Uğurlu",
        description: "Media paylaşıldı",
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Media paylaşıla bilmədi",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Media Paylaşımları</h2>
        
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12 space-y-4">
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
          
          <Select
            value={type}
            onValueChange={(value: 'image' | 'video') => setType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Media növü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Şəkil</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
            disabled={uploading}
          />
          
          <Button type="submit" disabled={uploading || !user}>
            {uploading ? 'Yüklənir...' : 'Paylaş'}
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={item.user?.avatar_url || undefined} />
                    <AvatarFallback>
                      {item.user?.first_name?.[0] || ''}
                      {item.user?.last_name?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {item.user?.first_name && item.user?.last_name 
                        ? `${item.user.first_name} ${item.user.last_name}`
                        : 'Naməlum istifadəçi'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(item.created_at), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600">{item.description}</p>
                )}
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <video 
                    src={item.url}
                    controls
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}