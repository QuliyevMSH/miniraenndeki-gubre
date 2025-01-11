import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "user";
}

export const UserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      setProfiles(profilesData || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "İstifadəçi məlumatları yüklənmədi",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editingProfile.first_name,
          last_name: editingProfile.last_name,
          role: editingProfile.role,
        })
        .eq("id", editingProfile.id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "İstifadəçi məlumatları yeniləndi",
      });

      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "İstifadəçi məlumatları yenilənmədi",
      });
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) return;

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "İstifadəçi silindi",
      });

      fetchProfiles();
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "İstifadəçi silinmədi",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">İstifadəçilər</h2>
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {profile.first_name} {profile.last_name}
              </h3>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                {profile.role}
              </span>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingProfile(profile)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                {editingProfile && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>İstifadəçi Məlumatlarını Redaktə Et</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="first_name">Ad</Label>
                        <Input
                          id="first_name"
                          value={editingProfile.first_name || ""}
                          onChange={(e) =>
                            setEditingProfile({
                              ...editingProfile,
                              first_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Soyad</Label>
                        <Input
                          id="last_name"
                          value={editingProfile.last_name || ""}
                          onChange={(e) =>
                            setEditingProfile({
                              ...editingProfile,
                              last_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Rol</Label>
                        <Select
                          value={editingProfile.role}
                          onValueChange={(value: "admin" | "user") =>
                            setEditingProfile({
                              ...editingProfile,
                              role: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">İstifadəçi</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full">
                        Yadda Saxla
                      </Button>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteProfile(profile.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
