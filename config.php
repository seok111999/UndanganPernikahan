<?php
// config.php

// Izinkan akses dari semua origin (penting untuk testing lokal)
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');

// --- DETAIL KONEKSI DATABASE ---
$servername = "localhost";
$username = "root";     // Ganti dengan username MySQL Anda
$password = "";         // Ganti dengan password MySQL Anda
$dbname = "undangan";   // Nama database

// Buat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    // Jika koneksi gagal, hentikan eksekusi dan kirim respons error
    // Status 500 (Internal Server Error)
    http_response_code(500); 
    echo json_encode(['success' => false, 'message' => 'Koneksi database gagal. Cek config.php.']);
    exit();
}
?>