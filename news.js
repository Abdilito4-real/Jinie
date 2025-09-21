async function loadNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const newsContainer = document.getElementById('news-list') || document.getElementById('admin-news-list');
  if (!newsContainer) return;

  newsContainer.innerHTML = data.map(n => `
    <div class="card">
      <h3>${n.title}</h3>
      <p>${n.content}</p>
      <small>${new Date(n.created_at).toLocaleDateString()}</small>
      ${newsContainer.id === 'admin-news-list' ? `<button onclick="deleteNews('${n.id}')">Delete</button>` : ''}
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadNews);
