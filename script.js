document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio
    const audio = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    let isMuted = false;
    let audioInitialized = false;
    
    // Function to initialize and play audio
    const initAudio = () => {
        if (!audioInitialized) {
            audio.volume = 0.5;
            audio.play().then(() => {
                console.log('Audio playback started successfully');
                audioInitialized = true;
                // Show the mute button after audio starts playing
                muteBtn.style.display = 'block';
            }).catch(error => {
                console.log('Audio playback failed:', error);
            });
        }
    };
    
    // Add click event to mute/unmute button
    muteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!audioInitialized) {
            initAudio();
            return;
        }
        
        if (isMuted) {
            audio.volume = 0.5;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.title = 'Mute music';
            isMuted = false;
        } else {
            audio.volume = 0;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.title = 'Unmute music';
            isMuted = true;
        }
    });
    
    // Hide mute button initially and show a play button instead
    muteBtn.style.display = 'none';
    
    // Add a play overlay that will initialize audio on first click
    const playOverlay = document.createElement('div');
    playOverlay.className = 'play-overlay';
    playOverlay.innerHTML = '🎵 Click anywhere to enable music 🎵';
    document.body.appendChild(playOverlay);
    
    // Initialize audio on first user interaction with the page
    const initOnFirstInteraction = () => {
        initAudio();
        playOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(playOverlay);
        }, 1000);
        // Remove this event listener after first interaction
        document.removeEventListener('click', initOnFirstInteraction);
        document.removeEventListener('keydown', initOnFirstInteraction);
    };
    
    // Listen for both click and keydown events to handle different user interactions
    document.addEventListener('click', initOnFirstInteraction);
    document.addEventListener('keydown', initOnFirstInteraction);
    // DOM Elements
    const revealBtn = document.getElementById('reveal-btn');
    const secretMessage = document.getElementById('secret-message');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const responseMessage = document.getElementById('response-message');
    const heartContainer = document.getElementById('heart-container');
    const heartsContainer = document.getElementById('hearts-container');

    // Add typewriter effect to message
    const messageElement = document.querySelector('.message');
    if (messageElement) {
        const text = messageElement.textContent;
        messageElement.textContent = '';
        messageElement.classList.add('typewriter');
        messageElement.style.width = 'fit-content';
        
        // Animate text character by character
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                messageElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                messageElement.style.borderRight = 'none';
            }
        }
        
        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 1000);
    }
    
    // Show secret message when reveal button is clicked
    if (revealBtn) {
        revealBtn.addEventListener('click', function() {
            this.classList.add('hidden');
            secretMessage.classList.remove('hidden');
            animateHearts();
            // Trigger confetti when message is revealed
            triggerConfetti(100);
        });
    }

    // Handle Yes button click
    if (yesBtn) {
        yesBtn.addEventListener('click', function() {
            responseMessage.innerHTML = `
                <p class="big-text">Yay! You made my day! 🎉</p>
                <p>I can't wait to see you! 💕</p>
                <div class="heart-beat">💖</div>
            `;
            secretMessage.classList.add('hidden');
            responseMessage.classList.remove('hidden');
            
            // Create lots of hearts and confetti
            createHearts(30);
            triggerConfetti(200);
            
            // Add pulsing heart animation
            const heartBeat = document.querySelector('.heart-beat');
            if (heartBeat) {
                heartBeat.style.animation = 'heartBeat 1s infinite';
            }
            
            // Add to CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes heartBeat {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                .heart-beat {
                    font-size: 3rem;
                    margin: 1rem 0;
                    display: inline-block;
                }
            `;
            document.head.appendChild(style);
        });
    }

    // Handle No button hover and movement
    if (noBtn) {
        let moveCount = 0;
        let isMoving = false;
        const messages = [
            "Are you sure?",
            "Think again! 😊",
            "Don't be shy!",
            "Pretty please?",
            "I won't take no for an answer!"
        ];
        
        // Set initial position if not already set
        if (!noBtn.style.position) {
            noBtn.style.position = 'relative';
            noBtn.style.transition = 'all 0.5s ease';
        }

        // Function to move button away from cursor
        function moveButtonAway(event) {
            if (isMoving) return;
            isMoving = true;
            
            const buttonRect = noBtn.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;
            
            // Calculate distance from cursor to button center
            const distanceX = event.clientX - buttonCenterX;
            const distanceY = event.clientY - buttonCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // Only move if cursor is close to the button (within 150px)
            if (distance < 150) {
                // Calculate new position (opposite direction from cursor)
                const moveX = (distanceX / distance) * 100;
                const moveY = (distanceY / distance) * 100;
                
                // Change button text occasionally
                if (Math.random() > 0.7) {
                    noBtn.textContent = messages[Math.floor(Math.random() * messages.length)];
                }
                
                // Move button
                noBtn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
                
                // Create a small heart occasionally
                if (Math.random() > 0.5) {
                    createHearts(1);
                }
                
                // Reset position after a short delay
                setTimeout(() => {
                    noBtn.style.transform = 'translate(0, 0) scale(1.1)';
                    isMoving = false;
                }, 500);
            }
        }

        // Add mousemove event to the document
        document.addEventListener('mousemove', function(event) {
            const buttonRect = noBtn.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;
            
            // Calculate distance from cursor to button center
            const distanceX = event.clientX - buttonCenterX;
            const distanceY = event.clientY - buttonCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // If cursor is within 150px of the button, move it
            if (distance < 150) {
                moveButtonAway(event);
            }
        });

        // Handle click on the button
        noBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            responseMessage.innerHTML = `
                <p>That's okay! Take your time 😊</p>
                <p>I'll be here when you're ready!</p>
                <p class="small-text">(But I know you'll say yes eventually! 😉)</p>
            `;
            secretMessage.classList.add('hidden');
            responseMessage.classList.remove('hidden');
            
            // Add some floating hearts
            createHearts(10);
        });
        
        // Prevent button from being dragged
        noBtn.setAttribute('draggable', 'false');
    }

    // Animate heart in the container
    function animateHearts() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.fontSize = '3rem';
        heart.style.animation = 'float 2s ease-in-out infinite';
        heartContainer.innerHTML = '';
        heartContainer.appendChild(heart);
    }

    // Create confetti effect
    function triggerConfetti(particleCount) {
        confetti({
            particleCount: particleCount,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ffd8d8'],
            shapes: ['circle', 'square'],
            scalar: 0.8
        });
    }
    
    // Create floating hearts animation
    function createHearts(count) {
        const hearts = ['❤️', '💖', '💗', '💓', '💝'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.top = '100vh';
                heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
                heart.style.animation = `float-up ${Math.random() * 3 + 2}s linear forwards`;
                heart.style.opacity = '0.8';
                heart.style.pointerEvents = 'none';
                
                document.body.appendChild(heart);
                
                // Remove heart after animation
                setTimeout(() => {
                    heart.remove();
                }, 5000);
            }, i * 200);
        }
    }

    // Add some initial floating hearts
    setInterval(() => {
        if (Math.random() > 0.7) {
            createHearts(1);
        }
    }, 2000);

    // Add floating animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% { 
                transform: translateY(0) rotate(0deg);
                opacity: 0.8;
            }
            100% { 
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
