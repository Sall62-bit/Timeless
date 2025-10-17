const $ = (sel, root=document) => root.querySelector(sel);
const payload = { id: editingId || crypto.randomUUID(), date, desc, cat, amount, note };
upsert(payload);
form.reset(); $('#date').value = todayISO(); delete form.dataset.editingId;
$('.btn-primary', form).textContent = '+ Tambah';
});


$('#table').addEventListener('click', (e)=>{
const btn = e.target.closest('button'); if(!btn) return;
const id = btn.dataset.edit || btn.dataset.del;
const it = items.find(x=>x.id===id);
if(btn.dataset.edit){
$('#date').value = it.date; $('#desc').value = it.desc; $('#cat').value = it.cat; $('#amount').value = it.amount; $('#note').value = it.note||'';
form.dataset.editingId = it.id; $('.btn-primary', form).textContent = 'Simpan Perubahan';
window.scrollTo({top:0, behavior:'smooth'});
} else if(btn.dataset.del){
if(confirm('Hapus transaksi ini?')) removeById(id);
}
});


$('#q').addEventListener('input', applyFilters);
$('#month').addEventListener('change', applyFilters);


$('#exportCsv').addEventListener('click', ()=>{
const {m,q} = currentFilters();
const filtered = items.filter(x=> x.date.startsWith(m) && (q==='' || (x.desc+" "+x.cat+" "+(x.note||'')).toLowerCase().includes(q)) );
const rows = [['id','date','desc','cat','amount','note'], ...filtered.map(x=>[x.id,x.date,x.desc,x.cat,x.amount,x.note?.replaceAll('
',' ')||''])];
const csv = rows.map(r=> r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('
');
download(csv, `pengeluaran_${m}.csv`, 'text/csv');
});


$('#exportJson').addEventListener('click', ()=>{
download(JSON.stringify(items,null,2), `pengeluaran_backup.json`, 'application/json');
});


$('#importJsonInput').addEventListener('change', async (e)=>{
const file = e.target.files[0]; if(!file) return;
try{
const text = await file.text();
const data = JSON.parse(text);
if(!Array.isArray(data)) throw new Error('Format tidak valid');
for(const x of data){ if(!x.id||!x.date||!x.desc||typeof x.amount!=="number") throw new Error('Data kurang lengkap') }
items = data; save(items); refreshMonthOptions(); applyFilters(); alert('Import sukses ✅');
}catch(err){ alert('Gagal import: '+ err.message) }
e.target.value = '';
});


$('#resetAll').addEventListener('click', ()=>{
if(confirm('Hapus semua data? (tidak bisa di-undo)')){ items = []; save(items); refreshMonthOptions(); applyFilters(); }
});


$('#backupHint').addEventListener('click', ()=> alert('Saran: lakukan Export JSON tiap minggu/bulan agar aman kalau ganti HP/PC.'))


function download(content, filename, type){
const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob);
const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}


refreshMonthOptions(); applyFilters();
