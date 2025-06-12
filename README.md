🏬 Xperimall
Xperimall adalah aplikasi direktori mall digital yang dikembangkan secara internal. Aplikasi ini menyediakan fitur seperti daftar tenant, promo, perencana aktivitas, dan lainnya.

Proyek ini terdiri dari dua bagian utama:

Frontend: React Native menggunakan Expo (SDK 52)

Backend: Golang + MySQL

🔗 Repository
GitHub: https://github.com/fl4me04/xperimall.git

📦 Langkah Awal
bash
Salin
Edit
git clone https://github.com/fl4me04/xperimall.git
cd xperimall
🖥️ Backend (Golang)
📁 Lokasi
/XperimallBackend

▶️ Cara Menjalankan
Pastikan sudah menginstall Go dan MySQL.

Jalankan backend:

bash
Salin
Edit
cd XperimallBackend
go run main.go
💡 Catatan: Pastikan konfigurasi koneksi database sudah sesuai di dalam kode (main.go atau file konfigurasi terkait).

📱 Frontend (React Native + Expo)
📁 Lokasi
Root directory (/)

🧩 Install Dependencies
bash
Salin
Edit
npm install
▶️ Jalankan App
❗ Catatan penting:
Aplikasi ini menggunakan Expo SDK 52, yang tidak kompatibel dengan Expo Go (sandbox app).
Wajib menggunakan Android Studio Emulator atau iOS Simulator.

Pastikan emulator aktif (misal: Android Studio).

Jalankan project:

bash
Salin
Edit
npx expo start
Pilih opsi: Run on Android emulator (atau iOS simulator jika di Mac).
