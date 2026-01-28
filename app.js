const SUPABASE_URL = 'https://fwepjzgaffdnxadlhezm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ng2F6YJ2VzvAjNZCZH2KrQ_b_Xumjqq';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementi DOM
const wardrobeGrid = document.getElementById('wardrobeGrid');
const clothingForm = document.getElementById('clothingForm');
const modal = document.getElementById('modal');

// Carica i dati all'avvio
document.addEventListener('DOMContentLoaded', () => {
    fetchClothing();
    lucide.createIcons();
});

async function fetchClothing() {
    const { data, error } = await _supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Errore:", error);
    } else {
        renderWardrobe(data);
        renderStats(data);
    }
}

function renderWardrobe(items) {
    wardrobeGrid.innerHTML = items.map(item => `
        <div class="clothing-card">
            <img src="${item.image_url || 'https://via.placeholder.com/300'}" alt="${item.name}">
            <div class="info">
                <strong>${item.name}</strong>
                <p>${item.category} • ${item.style}</p>
            </div>
        </div>
    `).join('');
}

function renderStats(items) {
    const statsBar = document.getElementById('statsBar');
    const categories = ['top', 'bottom', 'shoes'];
    statsBar.innerHTML = categories.map(cat => `
        <div class="stat-card">
            <h3>${items.filter(i => i.category === cat).length}</h3>
            <p>${cat.toUpperCase()}</p>
        </div>
    `).join('');
}

// Gestione Modal
document.getElementById('openFormBtn').onclick = () => modal.style.display = 'flex';
document.getElementById('closeFormBtn').onclick = () => modal.style.display = 'none';

// Salvataggio nuovo capo
clothingForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(clothingForm);
    const newItem = Object.fromEntries(formData.entries());

    const { error } = await _supabase.from('clothing_items').insert([newItem]);
    
    if (!error) {
        clothingForm.reset();
        modal.style.display = 'none';
        fetchClothing();
    } else {
        alert("Errore nel salvataggio!");
    }
};