<?php
// get_comments.php

// Sertakan file konfigurasi database
include 'config.php'; 

// Query untuk mengambil semua komentar, diurutkan dari yang terbaru (DESC)
$sql = "SELECT name, message, timestamp FROM comments ORDER BY timestamp DESC";
$result = $conn->query($sql);

$comments = [];

if ($result) {
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Format tanggal agar lebih rapi di frontend
            // Contoh: 12/12/2025 18:15
            $row['timestamp'] = date("d/m/Y H:i", strtotime($row['timestamp'])); 
            $comments[] = $row;
        }
    }
} else {
    // Jika ada error pada query SQL
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menjalankan query SQL. Error: ' . $conn->error]);
    $conn->close();
    exit();
}

// Kembalikan array komentar dalam format JSON
echo json_encode($comments);

$conn->close();
?>