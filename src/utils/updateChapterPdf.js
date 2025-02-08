import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function updateChapterPdf(mangaTitle, chapterNumber) {
  try {
    // First get the manga ID
    const { data: manga, error: mangaError } = await supabase
      .from('manga')
      .select('id')
      .eq('title', mangaTitle)
      .single();

    if (mangaError) throw mangaError;

    // Get the PDF URL from storage
    const { data: { publicUrl } } = supabase.storage
      .from('manga_pdfs')
      .getPublicUrl('Blue Lock - CH 001.pdf');

    // Update the chapter with the storage URL
    const { error: updateError } = await supabase
      .from('chapters')
      .update({ storage_url: publicUrl })
      .eq('manga_id', manga.id)
      .eq('chapter_number', chapterNumber);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error updating chapter PDF:', error);
    throw error;
  }
}