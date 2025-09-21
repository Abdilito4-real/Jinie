// gallery.js - fetch and render gallery and admin upload
async function fetchGalleryAll(){
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

function renderGallery(container, items, isAdmin=false){
  if(!container) return;
  container.innerHTML = items.map(g => `
    <div class="card">
      <div style="height:180px;overflow:hidden;border-radius:12px">
        <img src="${g.image_url}" alt="${(g.caption||'')}" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div style="padding:10px">
        <p style="margin:0 0 8px">${g.caption || ''}</p>
        ${isAdmin ? `<button class="btn btn-outline" onclick="deleteGallery('${g.id}')">Delete</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function loadGallery(){
  const el = document.getElementById('gallery');
  const adminEl = document.getElementById('admin-gallery-list');
  const previewEl = document.getElementById('gallery-preview');
  const items = await fetchGalleryAll();
  renderGallery(el, items.slice(0,100), false);
  renderGallery(adminEl, items.slice(0,100), true);
  if(previewEl) previewEl.innerHTML = items.slice(0,6).map(g=>`
    <div class="card"><div style="height:120px;overflow:hidden;border-radius:12px"><img src="${g.image_url}" alt="${g.caption||''}" style="width:100%;height:100%;object-fit:cover"></div><div style="padding:10px"><p style="margin:0">${g.caption||''}</p></div></div>
  `).join('');
}

async function deleteGallery(id){
  if(!confirm('Delete this image?')) return;
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if(error) alert('Error: '+error.message); else { alert('Deleted'); loadGallery(); }
}

/* Admin upload handler for gallery form */
document.addEventListener('DOMContentLoaded', ()=>{
  const gform = document.getElementById('gallery-form');
  if(gform){
    gform.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fileInput = document.getElementById('gallery-file');
      const caption = document.getElementById('gallery-caption').value || '';
      if(!fileInput.files.length){ alert('Select a file'); return; }
      const file = fileInput.files[0];
      const path = `gallery/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
      if(upErr){ alert('Upload error: '+upErr.message); return; }
      const publicUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
      const { error } = await supabase.from('gallery').insert([{ image_url: publicUrl, caption }]);
      if(error){ alert('DB error: '+error.message); return; }
      alert('Uploaded!');
      gform.reset();
      loadGallery();
    });
  }
  loadGallery();
});
