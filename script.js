// 1. URL Web App Google Apps Script
const webAppUrl = "https://script.google.com/macros/s/AKfycbxupD83pme8e0Z-O9SUpLgngPI54dEDKJ6alr81CL41OOHdOVE44c3inRrhsGjGuM8g/exec"; 

function onScanSuccess(decodedText) {
    // Berhenti scan agar tidak duplikat
    html5QrcodeScanner.clear();

    // 2. Memecah data dari Barcode (Pemisah tanda '|')
    // Urutan Barcode: Tgl|Jam|ID|Nama|Bln|Thn|Ket
    const dataArray = decodedText.split("|");
    
    // 3. Memetakan data agar PAS dengan Kolom A-G
    const payload = {
        p_tgl:  dataArray[0] || "-", // Kolom A
        p_jam:  dataArray[1] || "-", // Kolom B
        p_id:   dataArray[2] || "-", // Kolom C (ID SISWA)
        p_nama: dataArray[3] || "-", // Kolom D (NAMA SISWA)
        p_bln:  dataArray[4] || "-", // Kolom E (BULAN)
        p_thn:  dataArray[5] || "-", // Kolom F (TAHUN)
        p_ket:  dataArray[6] || "HADIR" // Kolom G (KETERANGAN)
    };

    // 4. Menampilkan data ke layar (Agar ID tampil di ID, Nama di Nama)
    document.getElementById('result-box').classList.remove('hidden');
    document.getElementById('student-id').innerText = payload.p_id;   // Ini ID
    document.getElementById('student-name').innerText = payload.p_nama; // Ini Nama
    
    const statusText = document.getElementById('status-text');
    statusText.innerText = "⏳ SEDANG MENCATAT...";

    // 5. Kirim data ke Google Sheets
    const params = new URLSearchParams(payload).toString();
    fetch(`${webAppUrl}?${params}`, {
        method: 'GET',
        mode: 'no-cors' 
    })
    .then(() => {
        statusText.innerText = "✅ ABSENSI BERHASIL!";
        statusText.style.color = "#2ecc71";
        
        // Refresh halaman setelah 2.5 detik untuk scan baru
        setTimeout(() => {
            location.reload();
        }, 2500);
    })
    .catch(err => {
        statusText.innerText = "❌ GAGAL MENGIRIM DATA";
        statusText.style.color = "#e74c3c";
        console.error("Error:", err);
    });
}

// 6. Jalankan Scanner (Setting Ukuran & Kecepatan)
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { 
        fps: 15, 
        qrbox: { width: 250, height: 250 } 
    }
);
html5QrcodeScanner.render(onScanSuccess);
