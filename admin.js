// admin.js - handles creating news items (with optional image), and wiring quick refresh
document.addEventListener('DOMContentLoaded', ()=>{
  // News create
  const newsForm = document.getElementById('news-form');
  if(newsForm){
    newsForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const title = document.getElementById('news-title').value.trim();
      const content = document.getElementById('news-content').value.trim();
      const imgFile = document.getElementById('news-image')?.files[0];
      let imageUrl = null;
      if(imgFile){
        const path = `news/${Date.now()}_${imgFile.name}`;
        const { error: upErr } = await supabase.storage.from('gallery').upload(path, imgFile);
        if(upErr){ alert('Upload failed: '+upErr.message); return; }
        imageUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from('news').insert([{ title, content, image_url: imageUrl }]);
      if(error) alert('Error: '+error.message); else { alert('News added'); newsForm.reset(); loadNewsTo('admin-news-list'); loadNewsPreview(); }
    });
  }

  // Gallery form handled in gallery.js

  // Event form handled in events.js
});
