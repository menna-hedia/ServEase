import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

interface ProfileImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onUpload: (imageUrl: string) => void;
}

export default function ProfileImageUploadModal({
  isOpen,
  onClose,
  currentImage,
  onUpload,
}: ProfileImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============ FILE SELECTION ============
  const handleFileSelect = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WEBP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // ============ DRAG AND DROP ============
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // ============ UPLOAD ============
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const res = await fetch('/api/common/upload-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      console.log('Upload response:', result);

      if (res.ok && result.profileURL) {
        toast.success('Profile photo updated successfully!');
        onUpload(result.profileURL);
        handleClose();
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setUploading(false);
    }
  };

  // ============ CLOSE / RESET ============
  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Profile Picture">
      <div className="space-y-6">

        {/* Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={previewUrl || currentImage}
              alt="Profile preview"
              className="w-40 h-40 rounded-full object-cover border-4 border-primary"
            />
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-0 right-0 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${dragOver
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary'
            }`}
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-1">
            {selectedFile ? selectedFile.name : 'Click or drag an image here'}
          </p>
          <p className="text-sm text-muted-foreground">PNG, JPG, WEBP · Max 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* Uploading indicator */}
        {uploading && (
          <p className="text-center text-sm text-muted-foreground animate-pulse">
            Uploading, please wait…
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            className="flex-1"
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>

      </div>
    </Modal>
  );
}