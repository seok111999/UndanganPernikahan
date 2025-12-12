document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('open-invitation');
    const coverSection = document.getElementById('cover');
    const weddingMusic = document.getElementById('wedding-music');
    const mainContent = document.getElementById('main-content');
    
    // Elements for Comment Feature
    const wishesForm = document.getElementById('wishes-form');
    const commentList = document.getElementById('comment-list');


    // --- 1. BUKA UNDANGAN & PUTAR MUSIK ---
    openBtn.addEventListener('click', function() {
        // Sembunyikan cover section dengan transisi
        coverSection.classList.add('hidden');

        // Tampilkan konten utama setelah transisi
        setTimeout(() => {
            coverSection.style.display = 'none';
            mainContent.style.display = 'block';
        }, 1000); 

        // Putar musik 
        if (weddingMusic) {
            weddingMusic.play().catch(error => {
                console.log("Musik tidak bisa diputar otomatis:", error);
            });
        }
        
        // Muat komentar saat halaman utama terbuka
        loadComments();
    });

    // --- 2. COUNTDOWN TIMER LOGIC ---
    const targetDateElement = document.getElementById('targetDate');
    const targetDateString = targetDateElement.getAttribute('data-target-date');
    
    // Hanya jalankan Countdown jika data-target-date ada
    if (targetDateString) {
        const targetDate = new Date(targetDateString).getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formatTime = (time) => String(time).padStart(2, '0');

            if (document.getElementById('days')) {
                document.getElementById('days').innerHTML = formatTime(days);
                document.getElementById('hours').innerHTML = formatTime(hours);
                document.getElementById('minutes').innerHTML = formatTime(minutes);
                document.getElementById('seconds').innerHTML = formatTime(seconds);
            }

            if (distance < 0) {
                clearInterval(timerInterval);
                if (document.getElementById('countdown-timer')) {
                    document.getElementById('countdown-timer').innerHTML = "<span style='font-size: 1.5em; color: var(--secondary-color);'>AKAD TELAH USAI</span>";
                }
            }
        }

        updateCountdown(); 
        const timerInterval = setInterval(updateCountdown, 1000);
    }


    // --- 3. COPY ACCOUNT NUMBER LOGIC ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const accountNumber = this.getAttribute('data-account');
            
            navigator.clipboard.writeText(accountNumber).then(() => {
                const originalText = this.textContent;
                this.textContent = 'BERHASIL DISALIN!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Gagal menyalin:', err);
                alert('Gagal menyalin. Silakan salin manual: ' + accountNumber);
            });
        });
    });
    
    
    // --- 4. LOGIC KOMENTAR (Submission & Display) ---

    // FUNGSI UNTUK MENAMPILKAN KOMENTAR
    function displayComments(comments) {
        commentList.innerHTML = '';
        if (comments.length === 0) {
            commentList.innerHTML = '<p>Belum ada ucapan. Jadilah yang pertama!</p>';
            return;
        }

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            commentDiv.innerHTML = `
                <p><strong>${comment.name}</strong> <span class="comment-time">${comment.timestamp}</span></p>
                <p class="comment-message">${comment.message}</p>
            `;
            commentList.appendChild(commentDiv);
        });
    }

    // FUNGSI UNTUK MEMUAT KOMENTAR DARI SERVER
    function loadComments() {
        // Cek apakah elemen commentList ada dan apakah konten utama sudah terlihat
        if (commentList && mainContent.style.display !== 'none') {
            fetch('get_comments.php')
                .then(response => response.json())
                .then(data => {
                    displayComments(data);
                })
                .catch(error => {
                    console.error('Error saat memuat komentar:', error);
                    commentList.innerHTML = '<p style="color:red;">Gagal memuat ucapan dari server. (Cek file PHP dan koneksi DB)</p>';
                });
        }
    }

    // FUNGSI UNTUK MENGIRIM KOMENTAR BARU
    wishesForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Mengambil nilai dari input dengan ID
        const name = document.getElementById('wish-name').value;
        const message = document.getElementById('wish-message').value;
        const submitBtn = this.querySelector('button');

        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;

        fetch('submit_comment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, message: message })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                wishesForm.reset();
                loadComments(); // Muat ulang daftar komentar setelah sukses
            }
        })
        .catch(error => {
            console.error('Error saat mengirim ucapan:', error);
            alert('Terjadi kesalahan saat mengirim ucapan.');
        })
        .finally(() => {
            submitBtn.textContent = 'KIRIM';
            submitBtn.disabled = false;
        });
    });


    // --- 5. RSVP LOGIC ---
    document.getElementById('open-rsvp-form').addEventListener('click', function() {
        alert('Fitur RSVP akan membuka formulir eksternal/modal. Mohon hubungkan dengan formulir Anda.');
    });

    // Panggil loadComments() hanya setelah pengguna membuka undangan (di fungsi openBtn.addEventListener)
});
