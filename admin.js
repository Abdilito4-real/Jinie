const newsForm = document.getElementById('news-form');
if (newsForm) {
  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;

    const { error } = await supabase.from('news').insert([{ title, content }]);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("News added!");
      loadNews();
      newsForm.reset();
    }
  });
}

async function deleteNews(id) {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) {
    alert("Error deleting news: " + error.message);
  } else {
    alert("News deleted!");
    loadNews();
  }
}
