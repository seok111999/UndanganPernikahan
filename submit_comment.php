<?php
// submit_comment.php

// Sertakan file konfigurasi database
include 'config.php'; 

// Pastikan request method adalah POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Ambil data JSON dari body request
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // Amankan dan ambil data
    $name = isset($data['name']) ? trim($data['name']) : '';
    $message = isset($data['message']) ? trim($data['message']) : '';

    // Validasi dasar
    if (empty($name) || empty($message)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Nama dan pesan tidak boleh kosong.']);
        $conn->close();
        exit();
    }

    // Menggunakan Prepared Statement untuk mencegah SQL Injection
    $stmt = $conn->prepare("INSERT INTO comments (name, message) VALUES (?, ?)");
    
    // "ss" artinya kedua parameter yang diikat adalah string (s)
    $stmt->bind_param("ss", $name, $message);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Ucapan berhasil dikirim!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data ke database. Error: ' . $conn->error]);
    }

    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Metode request tidak diizinkan.']);
}

$conn->close();
?>