import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
  userId?: string;
}

export function AddFileDialog({ open, onOpenChange, onUploadSuccess, userId }: AddFileDialogProps) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [selectedAddFile, setSelectedAddFile] = useState<File | null>(null);
  const [addFileTitle, setAddFileTitle] = useState("");
  const [fileType, setFileType] = useState<"image" | "video" | "document" | "audio">("image");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInputMode, setVideoInputMode] = useState<"upload" | "link">("upload");
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [isUploadingDirectoryFile, setIsUploadingDirectoryFile] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("directory_categories")
          .select("name")
          .eq("file_type", fileType)
          .order("name");
        
        if (!error && data) {
          const parsed = data
            .map((d: any) => d.name.split(',').map((s: string) => s.trim()))
            .flat()
            .filter(Boolean);
          const uniqueCategories = Array.from(new Set(parsed)) as string[];
          setCategories(uniqueCategories);
          if (uniqueCategories.length > 0) {
            setSelectedCategory(uniqueCategories[0]);
          } else {
            setSelectedCategory("");
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (open) {
      fetchCategories();
    }
  }, [fileType, open]);

  const handleAddFileSubmit = async () => {
    if (!userId) {
      toast.error("Please ensure you are logged in.");
      return;
    }

    if (!selectedAddFile && !(fileType === "video" && videoUrl.trim())) {
      toast.error("Please select a file or provide a video URL.");
      return;
    }

    try {
      setIsUploadingDirectoryFile(true);
      let publicUrl = "";
      let finalName = "";
      let finalSize = "0 MB";

      if (selectedAddFile) {
        const fileExt = selectedAddFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('directory_assets')
          .upload(filePath, selectedAddFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('directory_assets')
          .getPublicUrl(filePath);
        
        publicUrl = data.publicUrl;
        finalName = selectedAddFile.name;
        finalSize = `${(selectedAddFile.size / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        // Video URL
        publicUrl = videoUrl.trim();
        finalName = "Linked Video";
        finalSize = "Link";
      }

      let coverUrl = "";
      if (selectedCoverImage) {
        const coverExt = selectedCoverImage.name.split('.').pop();
        const coverName = `${crypto.randomUUID()}_cover.${coverExt}`;
        const coverPath = `${userId}/${coverName}`;

        const { error: coverUploadError } = await supabase.storage
          .from('directory_assets')
          .upload(coverPath, selectedCoverImage);

        if (!coverUploadError) {
          const { data: coverData } = supabase.storage
            .from('directory_assets')
            .getPublicUrl(coverPath);
          coverUrl = coverData.publicUrl;
        }
      }

      const finalTitle = addFileTitle.trim() || finalName.replace(/\.[^/.]+$/, "");

      const { error: insertError } = await supabase
        .from('directory_files')
        .insert({
          user_id: userId,
          title: finalTitle,
          file_url: publicUrl,
          file_type: fileType,
          file_size: finalSize,
          tags: selectedCategory ? [selectedCategory] : [],
          stats: { likes: 0, views: 0, downloads: 0, coverUrl: coverUrl }
        });

      if (insertError) throw insertError;

      setSelectedAddFile(null);
      setVideoUrl("");
      setFileType("image");
      setVideoInputMode("upload");
      setSelectedCoverImage(null);
      setSelectedCategory("");
      onOpenChange(false);

      toast.success("File uploaded successfully");
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (err: any) {
      console.error("Error uploading file:", err);
      toast.error(err.message || "An error occurred while uploading.");
    } finally {
      setIsUploadingDirectoryFile(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className={categories.length > 0 ? "grid grid-cols-2 gap-4" : "space-y-1.5"}>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">File Type</Label>
              <select
                value={fileType}
                onChange={(e) => {
                  setFileType(e.target.value as any);
                  setSelectedAddFile(null);
                  setVideoUrl("");
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="image">Photo</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {categories.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Category</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.map((catName, idx) => (
                    <option key={idx} value={catName}>{catName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {fileType === "video" && (
            <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setVideoInputMode("upload")}
                className={cn(
                  "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all",
                  videoInputMode === "upload" 
                    ? "bg-white dark:bg-zinc-700 shadow-sm text-yellow-600 dark:text-yellow-400" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setVideoInputMode("link")}
                className={cn(
                  "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all",
                  videoInputMode === "link" 
                    ? "bg-white dark:bg-zinc-700 shadow-sm text-yellow-600 dark:text-yellow-400" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Provide Link
              </button>
            </div>
          )}

          {(fileType !== "video" || videoInputMode === "upload") && (
            <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const f = e.dataTransfer.files[0];
                setSelectedAddFile(f);
                if (!addFileTitle) setAddFileTitle(f.name.replace(/\.[^/.]+$/, ""));
              }
            }}
            onClick={() => addFileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2",
              isDraggingFile
                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                : "border-gray-300 dark:border-zinc-700 hover:border-yellow-500 dark:hover:border-yellow-500 bg-gray-50/50 dark:bg-zinc-800/50"
            )}
          >
            <input
              type="file"
              ref={addFileInputRef}
              className="hidden"
              accept={
                fileType === 'image' ? 'image/*' :
                fileType === 'video' ? 'video/*' :
                fileType === 'audio' ? 'audio/*' :
                fileType === 'document' ? '.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx' : undefined
              }
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  setSelectedAddFile(f);
                  if (!addFileTitle) setAddFileTitle(f.name.replace(/\.[^/.]+$/, ""));
                }
              }}
            />
            <Upload className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            {selectedAddFile ? (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{selectedAddFile.name}</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">{(selectedAddFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Drag and drop your {fileType} here, or <span className="text-yellow-600 dark:text-yellow-400 underline font-semibold">browse</span>
                </p>
              </div>
            )}
          </div>
          )}

          {fileType === "video" && videoInputMode === "link" && (
            <div className="space-y-1.5">
              <Label htmlFor="video-url" className="text-sm font-medium">Video URL (YouTube/Instagram/Facebook/Direct)</Label>
              <Input
                id="video-url"
                placeholder="https://..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
              />
            </div>
          )}

          {(fileType === "document" || fileType === "audio" || fileType === "video") && (
            <div className="space-y-1.5 pt-2">
              <Label className="text-sm font-medium">Cover Image (Thumbnail)</Label>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="border-dashed border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-xs"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  {selectedCoverImage ? "Change Cover" : "Upload Cover Image"}
                </Button>
                {selectedCoverImage && (
                  <span className="text-xs text-gray-500 max-w-[200px] truncate">
                    {selectedCoverImage.name}
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={coverImageInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedCoverImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="add-file-title" className="text-sm font-medium">Title</Label>
            <Input
              id="add-file-title"
              placeholder="Enter file title"
              value={addFileTitle}
              onChange={(e) => setAddFileTitle(e.target.value)}
              className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
            />
          </div>



          <div className="flex justify-end gap-2 pt-3">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedAddFile(null);
                setAddFileTitle("");
                setVideoUrl("");
                setFileType("image");
              }}
              className="border-gray-200 dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFileSubmit}
              disabled={isUploadingDirectoryFile}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium"
            >
              {isUploadingDirectoryFile ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
