document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('open-invitation');
    const coverSection = document.getElementById('cover');
    const weddingMusic = document.getElementById('wedding-music');
    const mainContent = document.getElementById('main-content');
    
    // --- 1. BUKA UNDANGAN & PUTAR MUSIK ---
    openBtn.addEventListener('click', function() {
        // Sembunyikan cover section dengan transisi
        coverSection.classList.add('hidden');

        // Tampilkan konten utama setelah transisi
        setTimeout(() => {
            coverSection.style.display = 'none';
            mainContent.style.display = 'block';
        }, 1000); 

        // Putar musik (Autoplay mungkin memerlukan interaksi pengguna, tapi kita sudah di dalam event click)
        if (weddingMusic) {
            weddingMusic.play().catch(error => {
                console.log("Musik tidak bisa diputar otomatis:", error);
            });
        }
    });

    // --- 2. COUNTDOWN TIMER LOGIC ---
    const targetDateElement = document.getElementById('targetDate');
    const targetDateString = targetDateElement.getAttribute('data-target-date');
    const targetDate = new Date(targetDateString).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Fungsi helper untuk format dua digit
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
                 document.getElementById('countdown-timer').innerHTML = "<span>Acara Sedang Berlangsung!</span>";
            }
        }
    }

    // Update setiap 1 detik
    updateCountdown(); 
    const timerInterval = setInterval(updateCountdown, 1000);


    // --- 3. COPY ACCOUNT NUMBER LOGIC ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const accountNumber = this.getAttribute('data-account');
            
            // Menggunakan Clipboard API modern
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
    
    // --- 4. WISHES & RSVP LOGIC (Placeholder) ---
    document.getElementById('wishes-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Ucapan berhasil dikirim! (Di aplikasi nyata, data ini akan dikirim ke server.)');
        this.reset();
    });

    document.getElementById('open-rsvp-form').addEventListener('click', function() {
        alert('Fitur RSVP akan membuka formulir eksternal atau modal. \n(Contoh: Google Forms/Typeform)');
        // Di sini Anda akan mengarahkan ke halaman/formulir RSVP yang sebenarnya
        // window.open("LINK_FORMULIR_RSVP_ANDA", "_blank"); 
    });

});