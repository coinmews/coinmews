import React, { forwardRef, useRef, ChangeEvent, useState } from 'react';
import { Input } from './input';

export interface FileInputProps extends React.ComponentPropsWithoutRef<'input'> {
  onFileChange?: (file: File | null) => void;
  showPreview?: boolean;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onFileChange, onChange, showPreview = false, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // Forward ref to internal input
    const handleRef = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Call the original onChange if provided
      if (onChange) {
        onChange(e);
      }
      
      // Handle file change and preview
      const file = e.target.files?.[0] || null;
      
      if (file && showPreview) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      
      // Call our special onFileChange handler
      if (onFileChange) {
        onFileChange(file);
      }
    };

    return (
      <div className="space-y-2">
        <Input
          ref={handleRef}
          type="file"
          onChange={handleChange}
          {...props}
        />
        {showPreview && previewUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 object-contain w-full"
            />
          </div>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput'; 