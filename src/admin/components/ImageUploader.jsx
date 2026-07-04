import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function ImageUploader({
  multiple = false,
  files = [],
  images = [],
  onFilesChange,
  onImagesChange,
}) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(urls);
    return () => urls.forEach((item) => URL.revokeObjectURL(item.url));
  }, [files]);

  const inputId = useMemo(() => `image-${Math.random().toString(36).slice(2)}`, []);

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);
    const availableSlots = Math.max(0, 4 - images.length - files.length);
    const nextFiles = multiple ? selected.slice(0, availableSlots) : selected.slice(0, 1);
    onFilesChange(multiple ? [...files, ...nextFiles] : nextFiles);
    event.target.value = '';
  };

  const removeExisting = (target) => {
    onImagesChange(images.filter((image) => image !== target));
  };

  const removeFile = (file) => {
    onFilesChange(files.filter((item) => item !== file));
  };

  const makeMain = (image) => {
    onImagesChange([image, ...images.filter((item) => item !== image)]);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        className="focus-ring flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ritual-border bg-ritual-background/70 px-4 py-6 text-center text-sm text-ritual-muted transition hover:border-ritual-gold hover:text-ritual-text"
      >
        <ImagePlus size={24} />
        <span className="mt-2 font-medium">{multiple ? 'Choose images' : 'Choose image'}</span>
        <span className="mt-1 text-xs">JPG, PNG, or WebP up to 5MB</span>
        {multiple ? <span className="mt-1 text-xs">Add 1 to 4 images. One image is enough.</span> : null}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      {multiple ? <p className="text-xs text-ritual-muted">{images.length + files.length}/4 images selected</p> : null}

      {(images.length || previews.length) ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.publicId || image.url} className="relative overflow-hidden rounded-lg border border-ritual-border bg-ritual-card">
              <img src={image.url} alt={image.alt || ''} className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between p-2">
                <button type="button" onClick={() => makeMain(image)} className="text-xs text-ritual-muted hover:text-ritual-gold">
                  <Star size={14} className="mr-1 inline" /> {index === 0 ? 'Main' : 'Set main'}
                </button>
                <button type="button" onClick={() => removeExisting(image)} className="text-ritual-muted hover:text-ritual-text" title="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {previews.map(({ file, url }) => (
            <div key={url} className="relative overflow-hidden rounded-lg border border-ritual-border bg-ritual-card">
              <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between p-2">
                <span className="truncate text-xs text-ritual-muted">{file.name}</span>
                <button type="button" onClick={() => removeFile(file)} className="text-ritual-muted hover:text-ritual-text" title="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
