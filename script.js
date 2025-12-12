const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Mengatur ukuran canvas agar full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Konfigurasi Mouse
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

// Event listener saat mouse bergerak
window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Class untuk membuat Partikel
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Method untuk menggambar titik partikel
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00ffcc'; // Warna titik
        ctx.fill();
    }

    // Method untuk mengupdate posisi (animasi)
    update() {
        // Cek apakah partikel mentok layar (biar memantul)
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Interaksi dengan Mouse (Efek Menghindar/Collision)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        
        // Pindahkan partikel
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

// Fungsi Inisialisasi Partikel
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; // Kecepatan X acak
        let directionY = (Math.random() * 2) - 1; // Kecepatan Y acak
        let color = '#00ffcc';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Fungsi Menghubungkan Garis (Constellation Effect)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

            // Jika jarak cukup dekat, gambar garis
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(0, 255, 204,' + opacityValue + ')'; // Warna garis cyan transparan
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop Animasi Utama
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight); // Hapus layar lama
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect(); // Panggil fungsi garis
}

// Resize Event (Agar responsif jika layar diubah ukurannya)
window.addEventListener('resize', 
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
);

// Menghilangkan interaksi mouse saat kursor keluar layar
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

init();
animate();
  
