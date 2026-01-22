// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú de navegación en móviles
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Cambiar estilo de la navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mostrar/ocultar botón "volver arriba"
        const backToTopButton = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // Botón "volver arriba"
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Formulario de contacto (simulación)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí normalmente enviarías el formulario a un servidor
            // Por ahora, solo mostraremos un mensaje de confirmación
            alert('¡Gracias por tu mensaje! Te responderé lo antes posible.');
            contactForm.reset();
        });
    }
    
    // Animaciones al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    document.querySelectorAll('.skill-category, .timeline-content, .project-card').forEach(el => {
        observer.observe(el);
    });
    
    // Mostrar año actual en el footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
    
    // Mostrar mensaje de bienvenida en consola
    console.log('%c¡Bienvenido al portfolio de Alejandro González!', 'color: #3498db; font-size: 18px; font-weight: bold;');
    console.log('%cTécnico en Operaciones de Sistemas', 'color: #2c3e50; font-size: 14px;');
        // ===== REPRODUCTOR DE MÚSICA =====
    
    // Datos de las canciones LOCALES
    const songs = [
        {
            title: "All Star",
            artist: "Smash Mouth",
            src: "assets/music/song1.mp3",
            cover: "assets/images/cover1.png",
            duration: "0:00"  // Se actualizará automáticamente
        },
        {
            title: "Killing In the Name", 
            artist: "Rage Against The Machine",
            src: "assets/music/song2.mp3",
            cover: "assets/images/cover2.png",
            duration: "0:00"
        },
        {
            title: "One More Time",
            artist: "Daft Punk",
            src: "assets/music/song3.mp3",
            cover: "assets/images/cover3.jpg",
            duration: "0:00"
        },
        {
            title: "Losing It",
            artist: "FISHER",
            src: "assets/music/song4.mp3",
            cover: "assets/images/cover4.jpg",
            duration: "0:00"
        },
        {
            title: "Untrust Us",
            artist: "Crystal Castles",
            src: "assets/music/song5.mp3",
            cover: "assets/images/cover5.jpg",
            duration: "0:00"
        }
    ];
    
    // Elementos del DOM
    const audioPlayer = new Audio();
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const albumCover = document.getElementById('albumCover');
    const songTitle = document.getElementById('songTitle');
    const artistName = document.getElementById('artistName');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const volumeSlider = document.getElementById('volumeSlider');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const playlistEl = document.getElementById('playlist');
    const progressContainer = document.querySelector('.progress-container');
    const musicPlayerSection = document.getElementById('musica');
    
    // Variables de estado
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let originalPlaylist = [...songs];
    let shuffledPlaylist = [];
    
    // Inicializar el reproductor
    function initMusicPlayer() {
        // Cargar la primera canción
        loadSong(currentSongIndex);
        
        // Crear la lista de reproducción
        renderPlaylist();
        
        // Configurar eventos
        setupEventListeners();
    }
    
    // Cargar canción
    function loadSong(index) {
        const song = songs[index];
        
        audioPlayer.src = song.src;
        albumCover.src = song.cover;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        
        // Actualizar elemento activo en la playlist
        updateActivePlaylistItem(index);
        
        // Cuando los metadatos estén cargados, mostrar duración
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });
    }
    
    // Renderizar lista de reproducción
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${index === currentSongIndex ? 'active' : ''}`;
            li.innerHTML = `
                <div>
                    <strong>${song.title}</strong>
                    <div class="text-muted small">${song.artist}</div>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            
            playlistEl.appendChild(li);
        });
    }
    
    // Actualizar elemento activo en la playlist
    function updateActivePlaylistItem(index) {
        const items = playlistEl.querySelectorAll('.list-group-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    
    // Formatear tiempo (segundos a MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Reproducir canción
    function playSong() {
        audioPlayer.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        musicPlayerSection.classList.add('playing');
    }
    
    // Pausar canción
    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        musicPlayerSection.classList.remove('playing');
    }
    
    // Siguiente canción
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        
        if (isPlaying) {
            playSong();
        }
    }
    
    // Canción anterior
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        
        if (isPlaying) {
            playSong();
        }
    }
    
    // Activar/desactivar shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        
        if (isShuffled) {
            // Guardar playlist original
            originalPlaylist = [...songs];
            
            // Crear playlist shuffleada
            shuffledPlaylist = [...songs];
            for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
            }
            
            // Actualizar array de canciones
            songs.length = 0;
            songs.push(...shuffledPlaylist);
            
            // Encontrar la canción actual en la nueva lista
            const currentSong = originalPlaylist[currentSongIndex];
            currentSongIndex = songs.findIndex(song => 
                song.title === currentSong.title && song.artist === currentSong.artist);
        } else {
            // Restaurar playlist original
            const currentSong = songs[currentSongIndex];
            songs.length = 0;
            songs.push(...originalPlaylist);
            
            // Encontrar la canción actual en la lista original
            currentSongIndex = songs.findIndex(song => 
                song.title === currentSong.title && song.artist === currentSong.artist);
        }
        
        renderPlaylist();
    }
    
    // Activar/desactivar repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.classList.toggle('active', isRepeated);
        audioPlayer.loop = isRepeated;
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Play/Pause
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });
        
        // Controles de navegación
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        
        // Barra de progreso
        progressContainer.addEventListener('click', (e) => {
            const progressWidth = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audioPlayer.duration;
            
            audioPlayer.currentTime = (clickX / progressWidth) * duration;
        });
        
        // Actualizar barra de progreso
        audioPlayer.addEventListener('timeupdate', () => {
            if (audioPlayer.duration) {
                const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
                currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            }
        });
        
        // Canción terminada
        audioPlayer.addEventListener('ended', () => {
            if (!isRepeated) {
                nextSong();
            }
        });
        
        // Control de volumen
        volumeSlider.addEventListener('input', () => {
            audioPlayer.volume = volumeSlider.value;
        });
        
        // Controles adicionales
        shuffleBtn.addEventListener('click', toggleShuffle);
        repeatBtn.addEventListener('click', toggleRepeat);
        
        // Teclado shortcuts
        document.addEventListener('keydown', (e) => {
            if (!musicPlayerSection) return;
            
            // Espacio: Play/Pause
            if (e.code === 'Space') {
                e.preventDefault();
                playBtn.click();
            }
            
            // Flecha derecha: Siguiente canción
            if (e.code === 'ArrowRight' && e.ctrlKey) {
                e.preventDefault();
                nextBtn.click();
            }
            
            // Flecha izquierda: Canción anterior
            if (e.code === 'ArrowLeft' && e.ctrlKey) {
                e.preventDefault();
                prevBtn.click();
            }
        });
    }
    
    // Inicializar el reproductor cuando el DOM esté listo
    initMusicPlayer();
});