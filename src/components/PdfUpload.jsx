import React, { useState } from 'react';
import { uploadPdf } from '../utils/uploadPdf';

function PdfUpload({ chapterId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const url = await uploadPdf(file, chapterId);
      onUploadComplete?.(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Choose PDF file</span>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-yellow-50 file:text-yellow-700
            hover:file:bg-yellow-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
      
      {uploading && (
        <div className="text-yellow-500">Uploading...</div>
      )}
      
      {error && (
        <div className="text-red-500">{error}</div>
      )}
    </div>
  );
}

export default PdfUpload;