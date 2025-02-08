import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function uploadPdf(file, chapterId) {
  try {
    // Upload file to storage
    const fileName = `chapter_${chapterId}_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('manga_pdfs')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('manga_pdfs')
      .getPublicUrl(fileName);

    // Update chapter with storage URL
    const { error: updateError } = await supabase
      .from('chapters')
      .update({ storage_url: publicUrl })
      .eq('id', chapterId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
}