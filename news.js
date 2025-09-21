// news.js - fetch and render news for pages + admin
async function fetchNewsAll() {
  const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderNewsList(container, items, isAdmin=false){
  if(!container) return;
  container.innerHTML = items.map(n => `
    <div class="announcement-card">
      ${n.image_url ? `<div class="announcement-img"><img src="${escapeHtml(n.image_url)}" alt="${escapeHtml(n.title)}"></div>` : ''}
      <div class="announcement-content">
        <span class="announcement-date">${new Date(n.created_at).toLocaleDateString()}</span>
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.content).slice(0,260)}${n.content && n.content.length>260 ? '…' : ''}</p>
        <div style="display:flex;gap:8px;margin-top:10px">
          ${isAdmin ? `<button class="btn btn-outline" onclick="deleteNews('${n.id}')">Delete</button>` : ''}
          <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadNewsTo(containerId='news-list'){
  const container = document.getElementById(containerId);
  if(!container) return;
  const all = await fetchNewsAll();
  const search = (document.getElementById('search')?.value || '').toLowerCase();
  const sort = (document.getElementById('sort')?.value || 'new');
  let items = all;
  if(search) items = items.filter(i => (i.title + ' ' + i.content).toLowerCase().includes(search));
  if(sort === 'old') items = items.reverse();
  renderNewsList(container, items, containerId === 'admin-news-list');
}

// preview for homepage
async function loadNewsPreview(){
  const el = document.getElementById('news-preview');
  if(!el) return;
  const all = await fetchNewsAll();
  el.innerHTML = all.slice(0,4).map(n => `
    <div class="announcement-card">
      ${n.image_url ? `<div class="announcement-img"><img src="${escapeHtml(n.image_url)}" alt="${escapeHtml(n.title)}"></div>` : ''}
      <div class="announcement-content">
        <span class="announcement-date">${new Date(n.created_at).toLocaleDateString()}</span>
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.content).slice(0,120)}${n.content && n.content.length>120 ? '…' : ''}</p>
      </div>
    </div>
  `).join('');
}

async function deleteNews(id){
  if(!confirm('Delete this news item?')) return;
  const { error } = await supabase.from('news').delete().eq('id', id);
  if(error) alert('Error: '+error.message); else { alert('Deleted'); loadNewsTo('admin-news-list'); loadNewsPreview(); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadNewsTo('news-list');
  loadNewsTo('admin-news-list');
  loadNewsPreview();
  document.getElementById('search')?.addEventListener('input', ()=> loadNewsTo('news-list'));
  document.getElementById('sort')?.addEventListener('change', ()=> loadNewsTo('news-list'));
});
