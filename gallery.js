async function loadGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const galleryContainer = document.getElementById('gallery');
  galleryContainer.innerHTML = data.map(g => `
    <div class="card">
      <img src="${g.image_url}" alt="${g.caption}" style="max-width:100%; border-radius:8px;">
      <p>${g.caption}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadGallery);
