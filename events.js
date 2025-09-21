// events.js - fetch and render events + admin create
async function fetchEventsAll(){
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  if(error){ console.error(error); return []; }
  return data || [];
}

function renderEventsList(container, items, isAdmin=false){
  if(!container) return;
  container.innerHTML = items.map(ev => `
    <div class="event-card">
      <div class="event-date">
        <span class="event-day">${new Date(ev.event_date).getDate().toString().padStart(2,'0')}</span>
        <span class="event-month">${new Date(ev.event_date).toLocaleString('default',{month:'short'})}</span>
      </div>
      <div class="event-details">
        <h3>${ev.title}</h3>
        <div class="event-time"><i class="far fa-clock"></i><span>${ev.event_time || ''}</span></div>
        <p class="event-desc">${(ev.description||'').slice(0,200)}${ev.description && ev.description.length>200 ? '…' : ''}</p>
        <div style="margin-top:8px">
          ${isAdmin ? `<button class="btn btn-outline" onclick="deleteEvent('${ev.id}')">Delete</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

async function loadEvents(){
  const el = document.getElementById('events-list');
  const adminEl = document.getElementById('admin-events-list');
  const previewEl = document.getElementById('events-preview');
  const items = await fetchEventsAll();
  renderEventsList(el, items, false);
  renderEventsList(adminEl, items, true);
  if(previewEl) previewEl.innerHTML = items.slice(0,3).map(ev=>`
    <div class="event-card">
      <div class="event-date">
        <span class="event-day">${new Date(ev.event_date).getDate().toString().padStart(2,'0')}</span>
        <span class="event-month">${new Date(ev.event_date).toLocaleString('default',{month:'short'})}</span>
      </div>
      <div class="event-details">
        <h3>${ev.title}</h3>
        <div class="event-time"><i class="far fa-clock"></i><span>${ev.event_time || ''}</span></div>
        <p class="event-desc">${(ev.description||'').slice(0,120)}${ev.description && ev.description.length>120 ? '…' : ''}</p>
      </div>
    </div>
  `).join('');
}

async function deleteEvent(id){
  if(!confirm('Delete this event?')) return;
  const { error } = await supabase.from('events').delete().eq('id', id);
  if(error) alert('Error: '+error.message); else { alert('Deleted'); loadEvents(); }
}

/* admin create handler */
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('event-form');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const title = document.getElementById('event-title').value.trim();
      const date = document.getElementById('event-date').value;
      const time = document.getElementById('event-time').value || '';
      const location = document.getElementById('event-location').value || '';
      const desc = document.getElementById('event-desc').value || '';
      const fileInput = document.getElementById('event-image');
      let imageUrl = null;

      if(fileInput?.files?.length){
        const file = fileInput.files[0];
        const path = `events/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
        if(upErr){ alert('Upload error: '+upErr.message); return; }
        imageUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
      }

      const insert = { title, event_date: date, event_time: time, location, description: desc, image_url: imageUrl };
      const { error } = await supabase.from('events').insert([insert]);
      if(error){ alert('Error: '+error.message); return; }
      alert('Event created');
      form.reset();
      loadEvents();
    });
  }
  loadEvents();
});
// events.js - fetch and render events + admin create
async function fetchEventsAll(){
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  if(error){ console.error(error); return []; }
  return data || [];
}

function renderEventsList(container, items, isAdmin=false){
  if(!container) return;
  container.innerHTML = items.map(ev => `
    <div class="event-card">
      <div class="event-date">
        <span class="event-day">${new Date(ev.event_date).getDate().toString().padStart(2,'0')}</span>
        <span class="event-month">${new Date(ev.event_date).toLocaleString('default',{month:'short'})}</span>
      </div>
      <div class="event-details">
        <h3>${ev.title}</h3>
        <div class="event-time"><i class="far fa-clock"></i><span>${ev.event_time || ''}</span></div>
        <p class="event-desc">${(ev.description||'').slice(0,200)}${ev.description && ev.description.length>200 ? '…' : ''}</p>
        <div style="margin-top:8px">
          ${isAdmin ? `<button class="btn btn-outline" onclick="deleteEvent('${ev.id}')">Delete</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

async function loadEvents(){
  const el = document.getElementById('events-list');
  const adminEl = document.getElementById('admin-events-list');
  const previewEl = document.getElementById('events-preview');
  const items = await fetchEventsAll();
  renderEventsList(el, items, false);
  renderEventsList(adminEl, items, true);
  if(previewEl) previewEl.innerHTML = items.slice(0,3).map(ev=>`
    <div class="event-card">
      <div class="event-date">
        <span class="event-day">${new Date(ev.event_date).getDate().toString().padStart(2,'0')}</span>
        <span class="event-month">${new Date(ev.event_date).toLocaleString('default',{month:'short'})}</span>
      </div>
      <div class="event-details">
        <h3>${ev.title}</h3>
        <div class="event-time"><i class="far fa-clock"></i><span>${ev.event_time || ''}</span></div>
        <p class="event-desc">${(ev.description||'').slice(0,120)}${ev.description && ev.description.length>120 ? '…' : ''}</p>
      </div>
    </div>
  `).join('');
}

async function deleteEvent(id){
  if(!confirm('Delete this event?')) return;
  const { error } = await supabase.from('events').delete().eq('id', id);
  if(error) alert('Error: '+error.message); else { alert('Deleted'); loadEvents(); }
}

/* admin create handler */
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('event-form');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const title = document.getElementById('event-title').value.trim();
      const date = document.getElementById('event-date').value;
      const time = document.getElementById('event-time').value || '';
      const location = document.getElementById('event-location').value || '';
      const desc = document.getElementById('event-desc').value || '';
      const fileInput = document.getElementById('event-image');
      let imageUrl = null;

      if(fileInput?.files?.length){
        const file = fileInput.files[0];
        const path = `events/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
        if(upErr){ alert('Upload error: '+upErr.message); return; }
        imageUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
      }

      const insert = { title, event_date: date, event_time: time, location, description: desc, image_url: imageUrl };
      const { error } = await supabase.from('events').insert([insert]);
      if(error){ alert('Error: '+error.message); return; }
      alert('Event created');
      form.reset();
      loadEvents();
    });
  }
  loadEvents();
});
