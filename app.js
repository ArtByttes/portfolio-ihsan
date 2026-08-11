/* -------------------------------------------------------------
   Ihsan Salleh Portfolio JavaScript Logic - 2026
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    lucide.createIcons();

    // ---------------------------------------------------------
    // 0. IMAGE ERROR FALLBACK
    // ---------------------------------------------------------
    const handleImageError = (img) => {
        img.style.display = 'none';
        // Portfolio cards/modal play video or image media, so never show the
        // "Image unavailable" box there — just hide the broken poster.
        if (img.closest('.portfolio-card') || img.closest('.portfolio-modal')) return;
        const placeholder = document.createElement('div');
        placeholder.className = 'card-img-fallback';
        placeholder.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-tertiary);color:var(--text-muted);font-size:14px;';
        placeholder.textContent = 'Image unavailable';
        img.parentNode.insertBefore(placeholder, img);
    };

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img), { once: true });
    });

    // ---------------------------------------------------------
    // 0b. SKILL TAG TAP-TO-REVEAL (touch / no-hover devices)
    // ---------------------------------------------------------
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasActive = tag.classList.contains('active');
            skillTags.forEach(t => t.classList.remove('active'));
            if (!wasActive) tag.classList.add('active');
        });
    });
    // Tap anywhere else to dismiss the revealed percentage (easy turn-off)
    document.addEventListener('click', () => {
        skillTags.forEach(t => t.classList.remove('active'));
    });

    // ---------------------------------------------------------
    // 1. STICKY HEADER & ACTIVE NAV LINKS
    // ---------------------------------------------------------
    const header = document.getElementById('global-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 80;

        header.classList.toggle('headroom-hidden', scrollingDown);
        header.classList.toggle('headroom-visible', !scrollingDown || currentScrollY < 80);

        // Sticky Header shrink
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Link highlight on scroll (only sections with a nav link)
        let currentSectionId = '';
        navLinks.forEach(link => {
            const id = link.getAttribute('href');
            if (id && id.startsWith('#')) {
                const section = document.querySelector(id);
                if (section) {
                    const sectionTop = section.offsetTop - 120;
                    const sectionHeight = section.offsetHeight;
                    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                        currentSectionId = id.substring(1);
                    }
                }
            }
        });
        // Fallback: pick last passed section if between tracked sections
        if (!currentSectionId) {
            let lastPassed = '';
            navLinks.forEach(link => {
                const id = link.getAttribute('href');
                if (id && id.startsWith('#')) {
                    const section = document.querySelector(id);
                    if (section && window.scrollY >= section.offsetTop - 120) {
                        lastPassed = id.substring(1);
                    }
                }
            });
            currentSectionId = lastPassed;
        }

        let activeLink = null;
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSectionId}`;
            link.classList.toggle('active', isActive);
            if (isActive) activeLink = link;
        });

        // Slide the glass indicator pill to the active link
        const navList = document.querySelector('.nav-list');
        if (navList) {
            if (activeLink) {
                const linkRect = activeLink.getBoundingClientRect();
                const listRect = navList.getBoundingClientRect();
                navList.style.setProperty('--ind-x', `${linkRect.left - listRect.left}px`);
                navList.style.setProperty('--ind-w', `${linkRect.width}px`);
            }
        }
    };

    window.addEventListener('scroll', () => {
        handleScroll();
        lastScrollY = window.scrollY;
    }, { passive: true });
    handleScroll(); // Trigger initial check

    // Custom Ease-in-out Smooth Scroll for Nav Links
    const easeInOutCubic = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    const headerOffset = 64; // header shrink height
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const startPosition = window.scrollY;
                    const distance = elementPosition - headerOffset - 20;
                    const duration = 800; // 0.8 seconds duration
                    let start = null;

                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
                        if (progress < duration) {
                            window.requestAnimationFrame(step);
                        } else {
                            window.scrollTo(0, startPosition + distance);
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            }
        });
    });

    // ---------------------------------------------------------
    // 2. LIGHT / DARK THEME SWITCHER
    // ---------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const setTheme = (theme) => {
        body.classList.toggle('light-theme', theme === 'light');
        body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    // Get stored theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // ---------------------------------------------------------
    // 2.5 LANGUAGE SWITCHER
    // ---------------------------------------------------------
    const langToggle = document.getElementById('lang-toggle');
    const translations = {
        ms: {
            'nav-home': 'Laman Utama',
            'nav-portfolio': 'Portfolio',
            'nav-about': 'Tentang Saya',
            'nav-contact': 'Hubungi',
            'hero-subtitle': 'Videographer & Multimedia Specialist yang berpengalaman',
            'hero-badge': 'Videographer / Editor / Freelance',
            'hero-cta': 'Hire Me!',
            'trust-title': 'Kualitas Visual yang Diakui oleh Industri Media Nasional',
            'award-title': 'Pemenang Berita Video Terbaik',
            'award-event': 'Anugerah Malam Wartawan Malaysia (MPI Petronas 2020)',
            'award-desc': 'Melalui karya dokumentari bertajuk <strong>"Kita Mesti Menang"</strong>, menonjolkan kualiti jurnalisme visual berimpak tinggi.',
            'stat-exp': 'Tahun Pengalaman',
            'stat-ads': 'Iklan & Dokumentari',
            'stat-collab': 'Kolaborasi Agensi Utama',
            'services-badge': 'Kepakaran Kami',
            'services-title': 'Layanan Produksi & Pasca-Produksi End&#8209;to&#8209;End',
            'services-desc': 'Dari idea kreatif hingga hasil render akhir, saya menyediakan penyelesaian visual menyeluruh untuk jenama dan organisasi.',
            'srv1-title': 'Dokumentari & Jurnalisme Sinematik',
            'srv1-desc': 'Arahan kamera profesional, penceritaan visual yang mendalam, dan dokumentasi realiti lapangan dengan estetika visual berkualiti filem.',
            'srv1-f1': 'Storytelling Berimpak',
            'srv1-f2': 'Temubual Berstruktur',
            'srv1-f3': 'Arahan Sinematografi',
            'srv2-title': 'Iklan TVC & Media Sosial (F&B / Retail)',
            'srv2-desc': 'Video promosi yang dinamik untuk menonjolkan produk makanan & retail anda, dioptimumkan untuk platform digital dengan sound design sinematik.',
            'srv2-f1': 'F&B Video Lighting',
            'srv2-f2': 'Pacing Cepat & Menarik',
            'srv2-f3': 'Optimasi Vertikal & Horizontal',
            'srv3-title': 'Pasca-Produksi & Multimedia',
            'srv3-desc': 'Suntingan video kelas industri di DaVinci Resolve & Premiere, grading warna gred profesional, grafik bergerak (motion graphics) dan infografik dinamik.',
            'srv3-f1': 'Color Grading Sinematik',
            'srv3-f2': 'Motion Graphics & VFX',
            'srv3-f3': 'Adunan Audio & Sound Design',
            'port-badge': 'Galeri Portfolio',
            'port-title': 'Hasil Kerja & Studi Kasus Terpilih',
            'port-desc': 'Terokai projek terpilih mengikut kategori. Letakkan kursor pada kad (desktop) untuk memainkan pratonton video.',
            'filter-doc': 'Dokumentari',
            'filter-ads': 'Event',
            'filter-fnb': 'F&B',
            'filter-gfx': 'Grafik',
            'filter-ani': 'Animasi',
            'filter-news': 'News Value',
            'work-badge': 'Proses Kerja',
            'work-title': 'Alur Kerja Kolaborasi Projek',
            'work-desc': 'Bagaimana kita bekerjasama untuk menukar idea kasar anda menjadi video sinematik yang sedia ditayangkan.',
            'step1-title': 'Pra-Produksi & Konsep',
            'step1-desc': 'Sesi sumbang saran dan perbincangan arah visual. Kami membina skrip, melakar papan cerita (storyboard), dan menetapkan jadual penggambaran yang teratur.',
            'step2-title': 'Produksi & Penggambaran',
            'step2-desc': 'Proses penggambaran profesional di lokasi. Saya menggunakan kelengkapan kamera gred pawagam, sistem pencahayaan sinematik, dan rakaman audio industri.',
            'step3-title': 'Pasca-Produksi & Hasil Akhir',
            'step3-desc': 'Suntikan keajaiban dalam penyuntingan. Suntingan jalan cerita, gred warna sinematik, penambahan kesan bunyi, revisi (2-3 kali), dan penghantaran fail resolusi tinggi.',
            'abt-badge': 'Tentang Saya',
            'abt-title': 'Di Sebalik Lensa & Skrin Suntingan',
            'abt-skills': 'Kemahiran Perisian Utama',
            'abt-resume': 'Muat Turun Resume Lengkap (PDF)',
            'price-badge': 'Pelan Kerjasama',
            'price-title': 'Kolaborasi Fleksibel Sesuai Kebutuhan Projek',
            'price-desc': 'Anggaran telus untuk membantu anda merancang pelaburan kandungan kreatif anda.',
            'price1-title': 'Day Rate / Kontrak Harian',
            'price1-desc': 'Terbaik untuk sewaan operator kamera bebas (freelance camera op) atau penyuntingan di lokasi.',
            'price1-f1': '10 Jam Waktu Penggambaran/Suntingan Sehari',
            'price1-f2': 'Termasuk Kelengkapan Kamera & Audio Asas',
            'price1-f3': 'Krew Tunggal (Solo Operator)',
            'price1-f4': 'Serahan Fail Mentah (Raw Footage) Disediakan',
            'price1-cta': 'Tanya Sebut Harga',
            'price-pop': 'TERPOPULER',
            'price2-title': 'Project-Based / Produksi Penuh',
            'price2-desc': 'Terbaik untuk penghasilan video komersial lengkap, video F&B promosi, atau dokumentari korporat.',
            'price2-f1': 'Pengurusan End-to-End (Pra hingga Pasca)',
            'price2-f2': 'Perancangan Papan Cerita & Skrip',
            'price2-f3': 'Set Kamera Cinema, Lighting & Audio Komplet',
            'price2-f4': 'Gred Warna Profesional & Sound Design',
            'price2-f5': 'Percuma 3 Pusingan Revisi Utama',
            'price2-cta': 'Bincang Projek Sekarang',
            'price-info': 'Keterangan Penting:',
            'price-note': 'Semua anggaran adalah fleksibel dan terbuka untuk rundingan mengikut kesesuaian bajet dan skala projek anda.',
            'test-badge': 'Maklum Balas Industri',
            'test-title': 'Apa Kata Rakan Kolaborator',
            'test-quote': '"Ihsan mempunyai mata sinematik yang luar biasa. Sepanjang bekerjasama di The Hatch, beliau sentiasa berjaya menterjemahkan idea papan cerita yang kompleks menjadi shot visual yang hidup, bernyawa, dan menyentuh emosi penonton. Dedikasi beliau terhadap penyuntingan video gred profesional adalah aset besar untuk sebarang projek."',
            'faq-badge': 'FAQ',
            'faq-title': 'Pertanyaan Sering Diajukan',
            'faq-desc': 'Jawapan pantas untuk persoalan lazim mengenai perkhidmatan dan kaedah kerja saya.',
            'cont-badge': 'Hubungi Saya',
            'cont-title': 'Mempunyai Cerita untuk Disampaikan? Mari Kita Abadikan Bersama.',
            'cont-intro': 'Sama ada anda mahu memulakan projek dokumentari, memerlukan video promosi F&B yang menggiurkan, atau sekadar ingin menyapa, pintu rundingan sentiasa terbuka.',
            'cont-email': 'Emel Profesional',
            'cont-phone': 'Hubungi / WhatsApp',
            'form-name': 'Nama Penuh',
            'form-email': 'Alamat Emel',
            'form-cat': 'Kategori Projek',
            'form-opt1': 'Dokumentari / Jurnalisme',
            'form-opt2': 'Iklan TVC / Media Sosial',
            'form-opt3': 'Pasca-Produksi / Suntingan',
            'form-opt4': 'Grafik / Animasi',
            'form-opt5': 'Lain-lain',
            'err-name': 'Sila masukkan nama penuh anda.',
            'err-email': 'Sila masukkan alamat emel yang sah.',
            'err-cat': 'Sila pilih kategori projek.',
            'err-msg': 'Sila tulis mesej anda.',
            'form-msg': 'Perincian Pesan Singkat',
            'form-btn': 'Hantar Mesej Kolaborasi',
            'p1-f1': '10 Jam Waktu Penggambaran/Suntingan Sehari',
            'p1-f2': 'Termasuk Kelengkapan Kamera & Audio Asas',
            'p1-f3': 'Krew Tunggal (Solo Operator)',
            'p1-f4': 'Serahan Fail Mentah (Raw Footage) Disediakan',
            'p2-f1': 'Pengurusan End-to-End (Pra hingga Pasca)',
            'p2-f2': 'Perancangan Papan Cerita & Skrip',
            'p2-f3': 'Penggambaran & Penyuntingan Lengkap',
            'p2-f4': 'Grafik Gerak & Color Grading',
            'p2-f5': 'Masa Kerja Mengikut Skop Projek',
            'succ-title': 'Mesej Berjaya Dihantar',
            'succ-desc': 'Terima kasih. Saya akan hubungi anda secepat mungkin.',
            'form-name-ph': 'cth: Ahmad Zaki',
            'form-email-ph': 'cth: zaki@company.com',
            'form-msg-ph': 'Nyatakan objektif, tarikh jangkaan, dan bajet kasar anda...',
            'abt-p1': 'Saya merupakan lulusan <strong>Seni Grafis & Reka Bentuk dari UNISEL</strong> yang memilih untuk mengejar minat mendalam dalam dunia penceritaan visual bergerak. Perjalanan karier saya bermula dari bilik berita media arus perdana di <strong>Malaysian Gazette</strong> sehinggalah ke agensi kreatif terkemuka, <strong>The Hatch</strong>.',
            'abt-p2': 'Berpangkalan di <strong>Sungai Buloh, Kuala Lumpur</strong>, saya bersedia untuk menerima tugasan di seluruh Malaysia mahupun di luar negara bagi menghasilkan karya yang bermakna, berciri sinematik, dan mencapai objektif perniagaan anda.',
            'faq-q1': 'Apakah Anda memiliki peralatan kamera dan lighting sendiri?',
            'faq-a1': 'Ya. Saya memiliki set peralatan kamera gred pawagam/produksi yang lengkap, termasuk unit pencahayaan (lighting kit), sistem mikrofon tanpa wayar (wireless audio), serta stesen kerja penyuntingan berkuasa tinggi yang sedia digunakan untuk penggambaran serta-merta.',
            'faq-q2': 'Apakah siap menerima projek di luar kawasan Kuala Lumpur/Selangor?',
            'faq-a2': 'Sangat bersedia. Walaupun bertapak di Sungai Buloh, saya bersedia untuk mengembara bagi menjayakan syuting komersial atau dokumentari di mana-mana sahaja di seluruh wilayah Semenanjung, Sabah, Sarawak, malah luar negara.',
            'faq-q3': 'Berapa kali jatah revisi yang didapatkan dalam proses editing?',
            'faq-a3': 'Untuk setiap projek pengeditan standard, saya menyediakan 2 hingga 3 kali pusingan revisi utama secara percuma. Ini memastikan kualiti hasil akhir bertepatan dengan jangkaan dan kepuasan anda.',
            'p1-title': 'Dari ICU ke Liang Lahad',
            'p1-desc': 'Dokumentari mendalam mengenai perjuangan petugas barisan hadapan dan realiti wad kritikal COVID-19.',
            'p1-res': '500k+ tontonan digital & maklum balas nasional',
            'p2-title': 'Kita Mesti Menang',
            'p2-desc': 'Kisah inspirasi masyarakat Malaysia menentang pandemik global yang mendapat anugerah media nasional.',
            'p2-res': 'Pemenang Berita Video Terbaik (MPI Petronas 2020)',
            'p3-title': 'Ramadan di Balik Jeriji Besi',
            'p3-desc': 'Paparan di sebalik tirai besi para petugas dan penghuni Penjara Kajang dalam menyambut Ramadan yang mulia ini.',
            'p4-title': 'Covid-19: Bekerja dengan Mayat yang Berbeza',
            'p4-desc': 'Dokumentari barisan hadapan. Kali ini mereka yang bekerja di Jabatan Forensik.',
            'p5-title': 'TUDM... Gagah Pertahan Sebuah Kedaulatan',
            'p5-desc': 'Liputan khas bagaimana Tentera Udara Diraja Malaysia (TUDM) menjalankan operasi rondaan udara maritim mereka.',
            'p6-title': 'Cocktail is Masterpiece',
            'p6-desc': 'Shoot at Ver Bar Kuala Lumpur.',
            'p7-title': 'Domingos de Tapas Sundays',
            'p7-desc': 'Video Highlight reel of Bocado Restaurant on event Domingos de Tapas.',
            'p8-title': 'Highlight Reel for New Restaurant Opening Feliz KL',
            'p8-desc': 'Latin American flavours and vibes at Feliz.',
            'p9-title': 'Highlight Reels for Nadodi Restaurant',
            'p9-desc': 'Heritage and childhood memories through meticulously crafted cocktails.',
            'p10-title': 'Taste Tradition with Aliyaa Jaffna Style Crab Curry',
            'p10-desc': 'A symphony of spices and succulent crab curry.',
            'p11-title': 'Majlis Amanat YB Menteri Ekonomi 2026',
            'p12-title': 'Majlis Penyenaraian Orkim Berhad',
            'p13-title': 'Minggu Ekonomi dan Kewangan Awam',
            'p14-title': 'Penggulungan Perbahasan Peringkat Jawatankuasa Ekonomi',
            'p15-title': 'Waytha Moorthy di Mana Kamu? Suasana Kecoh di Kuil Waytha Moorthy',
            'p15-desc': 'Insiden keganasan di kuil Sri Maha Mariamman',
            'p15-res': '',
            'p15-role': 'Videographer & Editor',
            'p16-title': 'PAK CIK ASKAR MENGAMUK di SEMENYIH! Melayu Sudah Lama Kena Tipu',
            'p16-desc': 'Seorang bekas tentera mengamuk mengenai isu PRK di Semenyih',
            'p16-res': '',
            'p16-role': 'Videographer & Editor',
            'p17-title': 'Isu Kuil Seri Maha Mariamman',
            'p17-desc': 'Berlaku kekecohan antara dua kumpulan di kuil Mariamman',
            'p17-res': '',
            'p17-role': 'Videographer & Editor',
            'p18-title': 'Infografik: Kenali Bendera Malaysia',
            'p18-desc': 'Projek multimedia pendidikan menerangkan sejarah dan maksud di sebalik Jalur Gemilang secara dinamik.',
            'p18-res': 'Digunakan sebagai bahan bantu mengajar sekolah menengah',
            'role-label': 'Peranan:',
            'result-label': 'Hasil:'
        },
        en: {
            'nav-home': 'Home',
            'nav-portfolio': 'Portfolio',
            'nav-about': 'About',
            'nav-contact': 'Contact',
            'hero-subtitle': 'Experienced Videographer & Multimedia Specialist',
            'hero-badge': 'Videographer / Editor / Freelance',
            'hero-cta': 'Hire Me!',
            'trust-title': 'Visual Quality Recognized by National Media Industry',
            'award-title': 'Best Video News Winner',
            'award-event': 'Malaysian Press Institute Awards (MPI Petronas 2020)',
            'award-desc': 'Through the documentary <strong>"Kita Mesti Menang"</strong>, highlighting high-impact visual journalism.',
            'stat-exp': 'Years of Experience',
            'stat-ads': 'Commercials & Documentaries',
            'stat-collab': 'Major Agency Collaborations',
            'services-badge': 'Our Expertise',
            'services-title': 'End&#8209;to&#8209;End Production & Post-Production Services',
            'services-desc': 'From creative ideas to final renders, I provide comprehensive visual solutions for brands and organizations.',
            'srv1-title': 'Documentaries & Cinematic Journalism',
            'srv1-desc': 'Professional camera direction, deep visual storytelling, and field reality documentation with film-quality aesthetics.',
            'srv1-f1': 'Impactful Storytelling',
            'srv1-f2': 'Structured Interviews',
            'srv1-f3': 'Cinematography Direction',
            'srv2-title': 'TVC & Social Media Ads (F&B / Retail)',
            'srv2-desc': 'Dynamic promotional videos to highlight your food & retail products, optimized for digital platforms with cinematic sound design.',
            'srv2-f1': 'F&B Video Lighting',
            'srv2-f2': 'Fast & Engaging Pacing',
            'srv2-f3': 'Vertical & Horizontal Optimization',
            'srv3-title': 'Post-Production & Multimedia',
            'srv3-desc': 'Industry-class video editing in DaVinci Resolve & Premiere, professional color grading, motion graphics, and dynamic infographics.',
            'srv3-f1': 'Cinematic Color Grading',
            'srv3-f2': 'Motion Graphics & VFX',
            'srv3-f3': 'Audio Mixing & Sound Design',
            'port-badge': 'Portfolio Gallery',
            'port-title': 'Selected Works & Case Studies',
            'port-desc': 'Explore selected projects by category. Hover over cards (desktop) to play video previews.',
            'filter-doc': 'Documentary',
            'filter-ads': 'Event',
            'filter-fnb': 'F&B',
            'filter-gfx': 'Graphics',
            'filter-ani': 'Animation',
            'filter-news': 'News Value',
            'work-badge': 'Workflow',
            'work-title': 'Project Collaboration Workflow',
            'work-desc': 'How we collaborate to turn your rough ideas into cinematic, broadcast-ready videos.',
            'step1-title': 'Pre-Production & Concept',
            'step1-desc': 'Brainstorming sessions and visual direction discussions. We build scripts, sketch storyboards, and set up an organized shooting schedule.',
            'step2-title': 'Production & Shooting',
            'step2-desc': 'Professional on-location shooting. I use cinema-grade camera equipment, cinematic lighting systems, and industry audio recording.',
            'step3-title': 'Post-Production & Final Delivery',
            'step3-desc': 'Injecting magic through editing. Storyline editing, cinematic color grading, sound effects, revisions (2-3 times), and high-resolution file delivery.',
            'abt-badge': 'About Me',
            'abt-title': 'Behind the Lens & Editing Screen',
            'abt-skills': 'Key Software Skills',
            'abt-resume': 'Download Full Resume (PDF)',
            'price-badge': 'Collaboration Plans',
            'price-title': 'Flexible Collaboration for Your Project Needs',
            'price-desc': 'Transparent estimates to help you plan your creative content investments.',
            'price1-title': 'Day Rate / Daily Contract',
            'price1-desc': 'Best for hiring freelance camera operators or on-location editing.',
            'price1-f1': '10 Hours of Shooting/Editing per Day',
            'price1-f2': 'Includes Basic Camera & Audio Equipment',
            'price1-f3': 'Single Crew (Solo Operator)',
            'price1-f4': 'Raw Footage Delivery Provided',
            'price1-cta': 'Request a Quote',
            'price-pop': 'MOST POPULAR',
            'price2-title': 'Project-Based / Full Production',
            'price2-desc': 'Best for complete commercial video production, promotional F&B videos, or corporate documentaries.',
            'price2-f1': 'End-to-End Management (Pre to Post)',
            'price2-f2': 'Storyboard & Script Planning',
            'price2-f3': 'Complete Cinema Camera, Lighting & Audio Set',
            'price2-f4': 'Professional Color Grading & Sound Design',
            'price2-f5': 'Free 3 Rounds of Major Revisions',
            'price2-cta': 'Discuss Your Project Now',
            'price-info': 'Important Note:',
            'price-note': 'All estimates are flexible and open for negotiation according to your budget and project scale.',
            'test-badge': 'Industry Feedback',
            'test-title': 'What Collaborators Say',
            'test-quote': '"Ihsan has an extraordinary cinematic eye. Throughout our collaboration at The Hatch, he consistently managed to translate complex storyboard ideas into visual shots that are lively, breathing, and emotionally touching. His dedication to professional-grade video editing is a huge asset to any project."',
            'faq-badge': 'FAQ',
            'faq-title': 'Frequently Asked Questions',
            'faq-desc': 'Quick answers to common questions about my services and working methods.',
            'cont-badge': 'Contact Me',
            'cont-title': 'Have a Story to Tell? Let\'s Capture It Together.',
            'cont-intro': 'Whether you want to start a documentary project, need an appetizing F&B promo video, or just want to say hello, the door to discussion is always open.',
            'cont-email': 'Professional Email',
            'cont-phone': 'Call / WhatsApp',
            'form-name': 'Full Name',
            'form-email': 'Email Address',
            'form-cat': 'Project Category',
            'form-opt1': 'Documentary / Journalism',
            'form-opt2': 'TVC Ads / Social Media',
            'form-opt3': 'Post-Production / Editing',
            'form-opt4': 'Motion Graphics / Animation',
            'form-opt5': 'Other',
            'err-name': 'Please enter your full name.',
            'err-email': 'Please enter a valid email address.',
            'err-cat': 'Please choose a project category.',
            'err-msg': 'Please write your message.',
            'form-msg': 'Short Message Details',
            'form-btn': 'Send Collaboration Message',
            'p1-f1': '10 Hours Shooting/Editing Per Day',
            'p1-f2': 'Basic Camera & Audio Gear Included',
            'p1-f3': 'Solo Operator',
            'p1-f4': 'Raw Footage Handover Provided',
            'p2-f1': 'End-to-End Management (Pre to Post)',
            'p2-f2': 'Storyboard & Script Planning',
            'p2-f3': 'Full Production & Editing',
            'p2-f4': 'Motion Graphics & Color Grading',
            'p2-f5': 'Working Hours Based on Project Scope',
            'succ-title': 'Message Sent Successfully',
            'succ-desc': 'Thank you. I will contact you as soon as possible.',
            'form-name-ph': 'e.g: Ahmad Zaki',
            'form-email-ph': 'e.g: zaki@company.com',
            'form-msg-ph': 'State your objective, expected date, and rough budget...',
            'abt-p1': 'I am a graduate in <strong>Graphic Art & Design from UNISEL</strong> who chose to pursue a deep passion for visual storytelling. My career journey started from the mainstream newsroom at <strong>Malaysian Gazette</strong> to the leading creative agency, <strong>The Hatch</strong>.',
            'abt-p2': 'Based in <strong>Sungai Buloh, Kuala Lumpur</strong>, I am ready to take on assignments across Malaysia or abroad to produce meaningful, cinematic works that achieve your business objectives.',
            'faq-q1': 'Do you have your own camera and lighting equipment?',
            'faq-a1': 'Yes. I own a complete set of cinema/production grade camera equipment, including lighting kits, wireless audio microphone systems, and a high-performance editing workstation ready for immediate shoots.',
            'faq-q2': 'Are you willing to accept projects outside the Kuala Lumpur/Selangor area?',
            'faq-a2': 'Absolutely. Although based in Sungai Buloh, I am ready to travel to execute commercial or documentary shoots anywhere across the Peninsula, Sabah, Sarawak, or even overseas.',
            'faq-q3': 'How many revision rounds are included in the editing process?',
            'faq-a3': 'For every standard editing project, I provide 2 to 3 major revision rounds for free. This ensures the final output quality meets your expectations and satisfaction.',
            'p1-title': 'Dari ICU ke Liang Lahad',
            'p1-desc': 'An in-depth documentary on the struggles of frontliners and the reality of COVID-19 critical wards.',
            'p1-res': '500k+ digital views & national feedback',
            'p2-title': 'Kita Mesti Menang',
            'p2-desc': 'An inspiring story of Malaysians fighting the global pandemic, which won a national media award.',
            'p2-res': 'Best Video News Winner (MPI Petronas 2020)',
            'p3-title': 'Ramadan Behind Iron Bars',
            'p3-desc': 'A look behind the bars at the officers and inmates of Kajang Prison during the holy month of Ramadan.',
            'p4-title': 'Covid-19: Working with the Dead',
            'p4-desc': 'Frontline documentary. This time with those working in the Forensics Department.',
            'p5-title': 'TUDM... Defending Sovereignty',
            'p5-desc': 'Special coverage of the Royal Malaysian Air Force (RUDM) conducting maritime air patrol operations.',
            'p6-title': 'Cocktail is Masterpiece',
            'p6-desc': 'Shoot at Ver Bar Kuala Lumpur.',
            'p7-title': 'Domingos de Tapas Sundays',
            'p7-desc': 'Video Highlight reel of Bocado Restaurant on event Domingos de Tapas.',
            'p8-title': 'Highlight Reel for New Restaurant Opening Feliz KL',
            'p8-desc': 'Latin American flavours and vibes at Feliz.',
            'p9-title': 'Highlight Reels for Nadodi Restaurant',
            'p9-desc': 'Heritage and childhood memories through meticulously crafted cocktails.',
            'p10-title': 'Taste Tradition with Aliyaa Jaffna Style Crab Curry',
            'p10-desc': 'A symphony of spices and succulent crab curry.',
            'p11-title': 'Minister of Economy Address Ceremony 2026',
            'p12-title': 'Orkim Berhad Listing Ceremony',
            'p13-title': 'Public Finance Economy Week',
            'p14-title': 'Economy Committee Level Debate Closing',
            'p15-title': 'Where is Waytha Moorthy? Tense Situation at Waytha Moorthy Temple',
            'p15-desc': 'Violence incident at Sri Maha Mariamman Temple',
            'p15-res': '',
            'p15-role': 'Videographer & Editor',
            'p16-title': 'PAK CIK ASKAR MENGAMUK di SEMENYIH! Malays Have Been Deceived for Too Long',
            'p16-desc': 'A former soldier rages over the PRK issue in Semenyih',
            'p16-res': '',
            'p16-role': 'Videographer & Editor',
            'p17-title': 'Sri Maha Mariamman Temple Issue',
            'p17-desc': 'Chaos erupted between two groups at the Mariamman temple',
            'p17-res': '',
            'p17-role': 'Videographer & Editor',
            'p18-title': 'Infographic: Know the Malaysian Flag',
            'p18-desc': 'An educational multimedia project explaining the history and meaning behind the Jalur Gemilang dynamically.',
            'p18-res': 'Used as a teaching aid in secondary schools',
            'role-label': 'Role:',
            'result-label': 'Result:'
        }
    };

    const getTranslation = (lang, key, fallback = '') => translations[lang]?.[key] || fallback;

    const applyTranslations = (lang) => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerHTML = getTranslation(lang, key, el.innerHTML);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.setAttribute('placeholder', getTranslation(lang, key, el.getAttribute('placeholder') || ''));
        });
    };

    const CATEGORY_LABELS = {
        dokumentari: { ms: 'Dokumentari', en: 'Documentary' },
        event: { ms: 'Event', en: 'Event' },
        fnb: { ms: 'F&B', en: 'F&B' },
        grafik: { ms: 'Grafik', en: 'Graphics' },
        animasi: { ms: 'Animasi', en: 'Animation' },
        news: { ms: 'News Value', en: 'News Value' },
        montage: { ms: 'Montage', en: 'Montage' },
        interview: { ms: 'Interview', en: 'Interview' },
        shortvideo: { ms: 'Short Video', en: 'Short Video' },
        brand: { ms: 'Brand', en: 'Brand' }
    };

    const PREFERRED_CATEGORY_ORDER = ['dokumentari', 'event', 'fnb', 'grafik', 'animasi', 'news', 'montage', 'interview', 'shortvideo', 'brand'];

    const getPresentCategories = () =>
        PREFERRED_CATEGORY_ORDER.filter(value =>
            document.querySelector(`.portfolio-card[data-category~="${value}"]`)
        );

    const getFilterCategories = (lang) =>
        getPresentCategories().map(value => ({
            label: (CATEGORY_LABELS[value] && CATEGORY_LABELS[value][lang]) || value,
            value
        }));

    const syncWheelLabels = (lang) => {
        if (!window.portfolioWheel) return;
        const cats = getPresentCategories();
        document.querySelectorAll('.option-wheel__item').forEach((el, index) => {
            const value = cats[index];
            el.textContent = (CATEGORY_LABELS[value] && CATEGORY_LABELS[value][lang]) || value || el.textContent;
        });
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        if (langToggle) langToggle.textContent = lang === 'ms' ? 'EN' : 'MS';
        applyTranslations(lang);
        localStorage.setItem('lang', lang);
        requestAnimationFrame(() => handleScroll());
        const typingElement = document.getElementById('typing-saya');
        if (typingElement) typingElement.textContent = lang === 'ms' ? 'Saya' : 'I am';
        syncWheelLabels(lang);
    };

    const savedLang = localStorage.getItem('lang') || 'ms';
    setLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'ms' ? 'en' : 'ms';
            setLanguage(newLang);
        });
    }

    // ---------------------------------------------------------
    // 3. MOBILE HAMBURGER MENU DRAWER
    // ---------------------------------------------------------
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    if (hamburger) hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu on clicking any navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of nav drawer
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ---------------------------------------------------------
    // 4. SHOWREEL MODAL LIGHTBOX
    // ---------------------------------------------------------
    const btnShowreel = document.getElementById('btn-showreel');
    const thumbnailShowreel = document.getElementById('thumbnail-showreel');
    const modal = document.getElementById('showreel-modal');
    const modalClose = document.getElementById('modal-close');
    const modalVideo = document.getElementById('modal-video-player');
    const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;

    const openModal = () => {
        if (!modal || !modalVideo) return;
        modal.style.display = 'flex';
        // Force reflow for transitions
        modal.offsetHeight;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling

        // Play showreel video
        modalVideo.currentTime = 0;
        modalVideo.play().catch(() => {});
    };

    const closeModal = () => {
        if (!modal || !modalVideo) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Pause showreel video
        modalVideo.pause();

        // Hide after animation finishes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // matching styles.css transition-normal
    };

    if (btnShowreel) btnShowreel.addEventListener('click', openModal);
    if (thumbnailShowreel) thumbnailShowreel.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ---------------------------------------------------------
    // 5. CASE STUDY CATEGORY FILTER (OPTION WHEEL)
    // ---------------------------------------------------------
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    // Hide placeholder/template cards that have no video/image source (e.g. unfilled card #18)
    portfolioCards.forEach(card => {
        if (!card.getAttribute('data-video') && !card.getAttribute('data-media')) {
            card.style.display = 'none';
        }
    });

    const filterCategories = getFilterCategories(document.documentElement.lang || 'ms');

    const wheelContainer = document.getElementById('portfolio-wheel-container');

    const initPortfolioWheel = () => {
        if (!wheelContainer || typeof window.OptionWheel === 'undefined') return;
        if (window.portfolioWheel) {
            window.portfolioWheel.destroy();
            window.portfolioWheel = null;
        }
        const isMobile = window.innerWidth <= 768;
        const currentLang = document.documentElement.lang || 'ms';
        const wheelLabels = getFilterCategories(currentLang).map(c => c.label);
        window.portfolioWheel = new window.OptionWheel(wheelContainer, {
            items: wheelLabels,
            defaultSelected: 0,
            textColor: 'var(--text-secondary)',
            activeColor: 'var(--text-primary)',
            fontSize: isMobile ? 3 : 3.5,
            spacing: isMobile ? 1.3 : 1.3,
            curve: 1,
            tilt: 8,
            blur: isMobile ? 1.5 : 1.5,
            fade: isMobile ? 0.35 : 0.35,
            minOpacity: 0.05,
            smoothing: 260,
            inset: 0,
            side: 'left',
            draggable: true,
            loop: false,
            onChange: (index) => {
                const filterValue = filterCategories[index].value;
                portfolioCards.forEach(card => {
                    if (!card.getAttribute('data-video') && !card.getAttribute('data-media')) {
                        card.style.display = 'none';
                        return;
                    }
                    const categoryStr = card.getAttribute('data-category');
                    const cardCategories = categoryStr ? categoryStr.split(',') : [];
                    if (cardCategories.includes(filterValue)) {
                        // If it was hidden, show it first so we can animate
                        if (card.style.display === 'none') {
                            card.style.display = '';
                            // Force reflow
                            card.offsetHeight;
                        }
                        card.classList.remove('fade-out');
                        card.classList.add('fade-in');
                    } else {
                        card.classList.remove('fade-in');
                        card.classList.add('fade-out');
                        // Hide after transition
                        setTimeout(() => {
                            if (card.classList.contains('fade-out')) {
                                card.style.display = 'none';
                            }
                        }, 400); // matches transition time
                    }
                });
                
                // Reset carousel scroll when changing filter
                const grid = document.getElementById('portfolio-grid');
                if (grid) {
                    grid.scrollTo({ left: 0, behavior: 'smooth' });
                    setTimeout(() => {
                        if (typeof window.updateCarouselButtons === 'function') {
                            window.updateCarouselButtons();
                        }
                    }, 450); // check after transition
                }
            }
        });
    };

    initPortfolioWheel();

    let wheelResizeTimer = null;
    let wheelWasMobile = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth <= 768;
        if (nowMobile === wheelWasMobile) return;
        wheelWasMobile = nowMobile;
        clearTimeout(wheelResizeTimer);
        wheelResizeTimer = setTimeout(initPortfolioWheel, 200);
    });

    // ---------------------------------------------------------
    // 5.5 PORTFOLIO CAROUSEL NAVIGATION
    // ---------------------------------------------------------
    const portfolioGrid = document.getElementById('portfolio-grid');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    window.updateCarouselButtons = () => {
        if (!portfolioGrid || !prevBtn || !nextBtn) return;
        
        if (portfolioGrid.scrollLeft <= 5) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }

        // Check if scrolled to end
        // Added 5px tolerance for fractional pixels
        if (Math.ceil(portfolioGrid.scrollLeft) >= portfolioGrid.scrollWidth - portfolioGrid.clientWidth - 5) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    };

    if (portfolioGrid && prevBtn && nextBtn) {
        portfolioGrid.addEventListener('scroll', window.updateCarouselButtons);
        // Initial state
        setTimeout(window.updateCarouselButtons, 100);

        const scrollCarousel = (direction) => {
            const visibleCards = Array.from(portfolioGrid.querySelectorAll('.portfolio-card:not([style*="display: none"])'));
            if (visibleCards.length === 0) return;

            const gridRect = portfolioGrid.getBoundingClientRect();
            let currentCard;

            if (direction === 'prev') {
                currentCard = visibleCards.find(card => {
                    const cardRect = card.getBoundingClientRect();
                    return cardRect.left >= gridRect.left - 10;
                }) || visibleCards[0];
            } else {
                currentCard = visibleCards.find(card => {
                    const cardRect = card.getBoundingClientRect();
                    return cardRect.left >= gridRect.left + gridRect.width / 2;
                }) || visibleCards[visibleCards.length - 1];
            }

            const scrollAmount = currentCard.offsetWidth + 24; // Width + gap
            portfolioGrid.scrollBy({ left: direction === 'prev' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => {
            if (!prevBtn.classList.contains('disabled')) scrollCarousel('prev');
        });

        nextBtn.addEventListener('click', () => {
            if (!nextBtn.classList.contains('disabled')) scrollCarousel('next');
        });
    }

    // ---------------------------------------------------------
    // 6. VIDEO AUTOPLAY ON CARD HOVER (DESKTOP ONLY)
    // ---------------------------------------------------------
    const isMobileDevice = () => {
        return (window.innerWidth <= 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };

    portfolioCards.forEach(card => {
        const video = card.querySelector('.card-video');

        if (video) {
            // Hide play button while preview is playing
            video.addEventListener('playing', () => card.classList.add('video-playing'));
            video.addEventListener('pause', () => card.classList.remove('video-playing'));

            // Mouse Enter (Hover starts)
            card.addEventListener('mouseenter', () => {
                if (!isMobileDevice() && portfolioModal && !portfolioModal.classList.contains('active')) {
                    video.play().catch(() => {});
                }
            });

            // Mouse Leave (Hover ends)
            card.addEventListener('mouseleave', () => {
                if (!isMobileDevice()) {
                    video.pause();
                    video.currentTime = 0;
                }
            });

            // Handle visibility or bandwidth optimization on resize
            window.addEventListener('resize', () => {
                if (isMobileDevice()) {
                    video.pause();
                }
            });
        }
    });

    // ---------------------------------------------------------
    // 6.5 PORTFOLIO VIDEO MODAL POPUP
    // ---------------------------------------------------------
    const portfolioModal = document.getElementById('portfolio-modal');
    const portfolioModalVideo = document.getElementById('portfolio-modal-video');
    const portfolioModalImage = document.getElementById('portfolio-modal-image');
    const portfolioModalClose = document.getElementById('portfolio-modal-close');
    const portfolioModalFullscreen = document.getElementById('portfolio-modal-fullscreen');
    const portfolioModalTitle = document.getElementById('portfolio-modal-title');
    const portfolioModalDesc = document.getElementById('portfolio-modal-desc');
    const portfolioModalBackdrop = document.querySelector('.portfolio-modal-backdrop');
    const portfolioModalContainer = document.querySelector('.portfolio-modal-container');

    const openPortfolioModal = (card) => {
        const videoSrc = card.getAttribute('data-video');
        const mediaSrc = card.getAttribute('data-media');
        const title = card.querySelector('.card-project-title')?.textContent || '';
        const desc = card.querySelector('.card-description')?.textContent || '';

        if (!videoSrc && !mediaSrc) return;

        const isImage = !!mediaSrc;

        // Force pause and reset all preview videos in cards
        const previewVideos = document.querySelectorAll('.portfolio-card .card-video');
        previewVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
            video.removeAttribute('src');
            video.load();
        });

        // Toggle image vs video display in the modal
        if (portfolioModalImage) {
            portfolioModalImage.style.display = isImage ? 'block' : 'none';
            portfolioModalImage.src = isImage ? mediaSrc : '';
        }
        if (portfolioModalVideo) {
            portfolioModalVideo.style.display = isImage ? 'none' : 'block';
        }

        // Set video source (only for non-image cards)
        if (!isImage && videoSrc) {
            const source = portfolioModalVideo.querySelector('source');
            if (source) {
                source.src = videoSrc;
                portfolioModalVideo.load();
            }
        }

        // Set info
        portfolioModalTitle.textContent = title;
        portfolioModalDesc.textContent = desc;

        // Show modal
        portfolioModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('portfolio-modal-open');

        // Auto-play video (images need no playback)
        if (!isImage && portfolioModalVideo) {
            portfolioModalVideo.muted = false;
            portfolioModalVideo.play().catch(() => {});
        }
    };

    const closePortfolioModal = () => {
        portfolioModal.classList.remove('active');
        document.body.style.overflow = '';
        portfolioModalVideo.pause();
        portfolioModalVideo.currentTime = 0;
        if (portfolioModalImage) portfolioModalImage.src = '';
        
        // Exit fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        // Wait for modal fade-out animation before restoring preview videos
        setTimeout(() => {
            document.body.classList.remove('portfolio-modal-open');
            // Restore preview video sources
            const previewVideos = document.querySelectorAll('.portfolio-card .card-video');
            previewVideos.forEach(video => {
                const card = video.closest('.portfolio-card');
                const hoverVideoSrc = video.getAttribute('data-hover-src');
                if (hoverVideoSrc && hoverVideoSrc !== 'null') {
                    video.src = hoverVideoSrc;
                }
            });
        }, 300);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            portfolioModalContainer.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    // Fullscreen button click
    if (portfolioModalFullscreen) {
        portfolioModalFullscreen.addEventListener('click', toggleFullscreen);
    }

    // Click on card-media to open modal
    portfolioCards.forEach(card => {
        const cardMedia = card.querySelector('.card-media');
        if (cardMedia && (card.getAttribute('data-video') || card.getAttribute('data-media'))) {
            cardMedia.addEventListener('click', (e) => {
                // Prevent if clicking on badge
                if (e.target.closest('.card-badge')) return;
                openPortfolioModal(card);
            });
        }
    });

    // Close modal events
    if (portfolioModalClose) {
        portfolioModalClose.addEventListener('click', closePortfolioModal);
    }
    if (portfolioModalBackdrop) {
        portfolioModalBackdrop.addEventListener('click', closePortfolioModal);
    }
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portfolioModal && portfolioModal.classList.contains('active')) {
            closePortfolioModal();
        }
    });

    // ---------------------------------------------------------
    // 7. FAQ ACCORDION EXPAND / COLLAPSE
    // ---------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-content').style.maxHeight = '0px';
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
        }
    });

    // ---------------------------------------------------------
    // 8. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll('.section-reveal');

    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once animated in
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.1, // trigger when 10% of element is in view
            rootMargin: '0px 0px -50px 0px' // offset to animate slightly before entering viewport
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => element.classList.add('visible'));
    }

    // ---------------------------------------------------------
    // 9. CONTACT FORM VALIDATION & SUBMISSION
    // ---------------------------------------------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    const successBox = document.getElementById('form-success-box');

    // Form Inputs
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const categorySelect = document.getElementById('form-category');
    const messageInput = document.getElementById('form-message');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const setError = (input, hasError) => {
        const group = input.closest('.form-group');
        group.classList.toggle('error', hasError);
    };

    // Live validation triggers
    if (nameInput) nameInput.addEventListener('input', () => setError(nameInput, nameInput.value.trim() === ''));
    if (emailInput) emailInput.addEventListener('input', () => setError(emailInput, !validateEmail(emailInput.value.trim())));
    if (categorySelect) categorySelect.addEventListener('change', () => setError(categorySelect, categorySelect.value === ''));
    if (messageInput) messageInput.addEventListener('input', () => setError(messageInput, messageInput.value.trim() === ''));

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Final validation check
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const categoryVal = categorySelect.value;
        const messageVal = messageInput.value.trim();

        const validations = [
            { input: nameInput, isValid: nameVal !== '' },
            { input: emailInput, isValid: validateEmail(emailVal) },
            { input: categorySelect, isValid: categoryVal !== '' },
            { input: messageInput, isValid: messageVal !== '' }
        ];

        let isValid = true;
        validations.forEach(({ input, isValid: valid }) => {
            setError(input, !valid);
            if (!valid) isValid = false;
        });

        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn.innerHTML;

            submitBtn.disabled = true;
            contactForm.setAttribute('aria-busy', 'true');
            const currentLang = document.documentElement.lang || 'ms';
            const sendingText = currentLang === 'ms' ? 'Sedang dihantar...' : 'Sending...';
            submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> ${sendingText}`;
            lucide.createIcons(); // refresh loader icon

            // Build WhatsApp message to owner's phone
            const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
            const waText =
                `*Mesej Baru dari Portfolio*\n\n` +
                `*Nama:* ${nameVal}\n` +
                `*Emel:* ${emailVal}\n` +
                `*Kategori:* ${categoryLabel}\n` +
                `*Mesej:* ${messageVal}`;
            const waUrl = `https://wa.me/60196266072?text=${encodeURIComponent(waText)}`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                contactForm.setAttribute('aria-busy', 'false');
                lucide.createIcons();

                // Open WhatsApp with pre-filled message (delivers to owner's phone)
                window.open(waUrl, '_blank', 'noopener');

                // Show success block
                successBox.classList.add('show');

                // Reset form fields
                contactForm.reset();

                // Clear success box after 8 seconds
                setTimeout(() => {
                    successBox.classList.remove('show');
                }, 8000);

            }, 800);
        }
    });

    // ---------------------------------------------------------
    // 9. TYPING EFFECT FOR HERO TITLE
    // ---------------------------------------------------------
    const typingSpan = document.getElementById('typing-saya');
    if (typingSpan) {
        const words = ['Saya', 'I am', '我', '私', '저는', 'நான்'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 200;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 100;
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 200;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingDelay = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingDelay = 500;
            }

            setTimeout(typeEffect, typingDelay);
        }

        setTimeout(typeEffect, 1000);
    }

    // ---------------------------------------------------------
    // 9.5 COVERFLOW (ABOUT SECTION)
    // ---------------------------------------------------------
    const coverflowTrack = document.getElementById('coverflow-track');
    const coverflowDots = document.getElementById('coverflow-dots');

    if (coverflowTrack && coverflowDots) {
        const items = coverflowTrack.querySelectorAll('.coverflow-item');
        const itemCount = items.length;
        let activeIndex = 0; // Start with first item (Portrait Photographer)

        // Create dots
        items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'coverflow-dot';
            if (i === activeIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            coverflowDots.appendChild(dot);
        });

        const dots = coverflowDots.querySelectorAll('.coverflow-dot');

        function updateCoverflow() {
            items.forEach((item, i) => {
                const offset = i - activeIndex;
                const absOffset = Math.abs(offset);
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;

                // Calculate transforms
                const x = offset * 80;
                const rotateY = isActive ? 0 : (isPast ? 40 : -40);
                const z = isActive ? 100 : -absOffset * 100;
                const scale = isActive ? 1.25 : 1 - (absOffset * 0.15);
                const opacity = absOffset > 2 ? 0 : 1 - (absOffset * 0.4);

                item.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.zIndex = 100 - absOffset;

                if (isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToSlide(index) {
            activeIndex = Math.max(0, Math.min(itemCount - 1, index));
            updateCoverflow();
        }

        function nextSlide() {
            goToSlide(activeIndex + 1);
        }

        function prevSlide() {
            goToSlide(activeIndex - 1);
        }

        // Button events
        const prevBtn = document.querySelector('.coverflow-prev');
        const nextBtn = document.querySelector('.coverflow-next');

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Item click events
        items.forEach((item, i) => {
            item.addEventListener('click', () => goToSlide(i));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Initialize
        updateCoverflow();
    }

    // ---------------------------------------------------------
    // 10. BACKGROUND MUSIC TOGGLE LOGIC
    // ---------------------------------------------------------
    const bgMusicBtn = document.getElementById('bg-music-toggle');
    if (bgMusicBtn) {
        bgMusicBtn.addEventListener('click', () => {
            if (!window.ytPlayer || typeof window.ytPlayer.playVideo !== 'function') return;
            if (window.isMusicPlaying) {
                window.ytPlayer.pauseVideo();
            } else {
                if (window.ytPlayer.isMuted && window.ytPlayer.isMuted()) {
                    window.ytPlayer.unMute();
                }
                window.ytPlayer.playVideo();
                updateMusicToggleUI();
            }
        });
    }

    // Unmute on first user interaction (browsers block autoplay with sound until then)
    document.body.addEventListener('click', () => {
        if (window.ytPlayer && typeof window.ytPlayer.unMute === 'function'
            && window.ytPlayer.isMuted && window.ytPlayer.isMuted()) {
            window.ytPlayer.unMute();
            updateMusicToggleUI();
        }
        window.userInteracted = true;
    }, { once: true });

});

// ---------------------------------------------------------
// YOUTUBE IFRAME API
// ---------------------------------------------------------
window.ytPlayer = null;
window.isMusicPlaying = false;
window.userInteracted = false;

window.onYouTubeIframeAPIReady = function() {
    window.ytPlayer = new YT.Player('youtube-player', {
        height: '200',
        width: '200',
        videoId: 'X4VbdwhkE10',
        playerVars: {
            'autoplay': 1,
            'mute': 1,
            'controls': 0,
            'showinfo': 0,
            'autohide': 1,
            'loop': 1,
            'playlist': 'X4VbdwhkE10', // Required for looping single video
            'modestbranding': 1,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': (e) => console.error('YouTube player error:', e.data)
        }
    });
};

// Safety net: if the IFrame API finished loading before this module assigned
// the callback, the player was never created. Initialize it now if ready.
if (window.YT && window.YT.Player && !window.ytPlayer) {
    window.onYouTubeIframeAPIReady();
}

function onPlayerReady(event) {
    // Muted autoplay is allowed by browsers; it will be unmuted on first interaction
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.BUFFERING) {
        window.isMusicPlaying = true;
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        window.isMusicPlaying = false;
    }
    updateMusicToggleUI();
}

function updateMusicToggleUI() {
    const toggleBtn = document.getElementById('bg-music-toggle');
    const icon = document.getElementById('music-icon');
    if (!toggleBtn || !icon) return;
    const muted = window.ytPlayer && window.ytPlayer.isMuted && window.ytPlayer.isMuted();
    const audible = !!window.isMusicPlaying && !muted;
    toggleBtn.classList.toggle('playing', audible);
    toggleBtn.setAttribute('aria-pressed', audible ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', audible ? 'Pause background music' : 'Play background music');
    icon.setAttribute('data-lucide', audible ? 'volume-2' : 'volume-x');
    lucide.createIcons();
}

/* Hero background video parallax on cursor (desktop only) */
function initHeroParallax() {
    const hero = document.getElementById('home');
    const videos = document.querySelectorAll('.hero-bg-video');
    if (!hero || !videos.length) return;
    if (!window.matchMedia('(min-width: 769px)').matches) return;

    const STRENGTH = 24; // max px shift
    let raf = null;
    let tx = 0, ty = 0;

    hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;  // -0.5 .. 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5;
        tx = -nx * STRENGTH;
        ty = -ny * STRENGTH;
        if (!raf) raf = requestAnimationFrame(apply);
    });

    hero.addEventListener('mouseleave', () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(apply);
    });

    function apply() {
        raf = null;
        videos.forEach(v => {
            v.style.setProperty('--px', tx.toFixed(2) + 'px');
            v.style.setProperty('--py', ty.toFixed(2) + 'px');
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
    initHeroParallax();
}

