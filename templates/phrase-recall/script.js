const phrases = [
      "bread milk sugar tomato carrot",
      "Hornbill festival is celebrated by Nagaland",
      "Bihu is celebrated three times a year",
      "Sikkim holds the majestic peak of Mt. Kanchenjunga",
      "Pehak is a famous dish of Arunachal Pradesh"
    ];

    const distractorWords = ["cat", "dance", "drama", "beautiful", "K2", "Manipur", "coffee", "butter", "five", "month","Assam","Thukpa","Momos","Chura","drink","Meghalaya"];

    let currentPhrase = "";
    let targetWords = [];
    let selectedWords = [];
    let countdown = 5;
    let timerInterval;
    let score = 0;
    
    let currentDifficulty = "medium";
    let memorizeTime = 5;
    let distractorCount = 4;
    let aiRecommendedDifficulty = 'medium'; // updated by ML API
    const PATIENT_ID = 1;

    const phraseDisplay = document.getElementById("phrase-display");
    const timerElement = document.getElementById("timer");
    const wordBank = document.getElementById("word-bank");
    const answerZone = document.getElementById("answer-zone");
    const submitBtn = document.getElementById("submit-btn");
    const resetBtn = document.getElementById("reset-btn");

    const modalOverlay = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    const startScreen = document.getElementById("start-screen");
    const gameScoreDisplay = document.getElementById("game-score");
    const startScoreDisplay = document.getElementById("start-score");
    const levelButtons = document.querySelectorAll(".level-btn");

    levelButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        playClickSound();
        const level = e.target.getAttribute("data-level");
        setDifficulty(level);
        startScreen.classList.remove("active");
        startGame();
      });
    });

    // ── Auto-start with AI difficulty on page load ────────────────────
    async function fetchRecommendedDifficulty() {
      try {
        const res  = await fetch(`/api/phrase-recall/recommend-difficulty/${PATIENT_ID}`);
        const data = await res.json();

        if (res.ok && data.recommended_difficulty) {
          aiRecommendedDifficulty = data.recommended_difficulty;
          setDifficulty(data.recommended_difficulty);
          console.log('[AI] Auto-starting at difficulty:', data.recommended_difficulty, '| Reason:', data.reason);
        }
      } catch (err) {
        console.warn('[AI] Could not fetch difficulty, defaulting to medium:', err);
        setDifficulty('medium');
      }

      // Hide start screen and immediately start the game
      if (startScreen) startScreen.classList.remove('active');

      // Show AI difficulty in header banner
      const banner = document.getElementById('ai-difficulty-banner');
      if (banner) banner.textContent = `🤖 ${currentDifficulty.toUpperCase()}`;

      startGame();
    }

    document.addEventListener('DOMContentLoaded', fetchRecommendedDifficulty);


    function setDifficulty(level) {
      currentDifficulty = level;
      if (level === "easy") {
        memorizeTime = 7;
        distractorCount = 2;
      } else if (level === "medium") {
        memorizeTime = 5;
        distractorCount = 4;
      } else if (level === "hard") {
        memorizeTime = 3;
        distractorCount = 7;
      }
    }

    function showModal(title, message) {
      modalTitle.innerText = title;
      modalMessage.innerText = message;
      modalOverlay.classList.add("active");
    }

    modalCloseBtn.addEventListener("click", () => {
      playClickSound();
      modalOverlay.classList.remove("active");
      fetchRecommendedDifficulty();
    });

    function startGame() {
      // Reset state
      answerZone.innerHTML = "";
      wordBank.innerHTML = "";
      selectedWords = [];
      countdown = memorizeTime;
      submitBtn.disabled = true;

      // Select random phrase
      currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      targetWords = currentPhrase.split(" ");
      phraseDisplay.innerText = currentPhrase;
      timerElement.innerText = `Memorize: ${countdown}s`;

      // Start countdown timer
      timerInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          timerElement.innerText = `Memorize: ${countdown}s`;
        } else {
          clearInterval(timerInterval);
          timerElement.innerText = "Reconstruct the phrase!";
          phraseDisplay.innerText = "?"; // Hide the target phrase
          setupWordBank();
        }
      }, 1000);
    }

    function setupWordBank() {
      // Combine target words with distractor words based on difficulty
      const randomDistractors = distractorWords.sort(() => 0.5 - Math.random()).slice(0, distractorCount);
      const pool = [...targetWords, ...randomDistractors].sort(() => 0.5 - Math.random());

      pool.forEach((word) => {
        const btn = document.createElement("button");
        btn.className = "word-btn";
        btn.innerText = word;
        btn.onclick = () =>{ 
          playClickSound();
          moveToAnswer(btn, word);

        }
        wordBank.appendChild(btn);
      });

      submitBtn.disabled = false;
    }

    function moveToAnswer(buttonElement, word) {
      selectedWords.push(word);
      answerZone.appendChild(buttonElement);
      
      // Clicking in the answer line moves it back to the word bank
      buttonElement.onclick = () => moveToBank(buttonElement, word);
    }

    function moveToBank(buttonElement, word) {
      const index = selectedWords.indexOf(word);
      if (index > -1) {
        selectedWords.splice(index, 1);
      }
      wordBank.appendChild(buttonElement);
      buttonElement.onclick = () => moveToAnswer(buttonElement, word);
    }

    submitBtn.addEventListener("click", async () => {
  const userAnswer = selectedWords.join(" ");
  const isCorrect = userAnswer === currentPhrase;
  const roundScore = isCorrect ? 10 : 0;

  if (isCorrect) {
    score += 10;
    gameScoreDisplay.innerText = score;
    startScoreDisplay.innerText = score;
    playWinSound();
    showModal("Success!", "Correct! You earned 10 points!");
  } else {
    playLoseSound();
    showModal("Try Again", "Incorrect answer. Move to next level !");
  }

  // Send game result to Flask backend
  try {
    const response = await fetch("/api/phrase-recall/game/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patient_id: 1,
        difficulty: currentDifficulty,
        phrase: currentPhrase,
        user_answer: userAnswer,
        correct: isCorrect,
        score: roundScore
      })
    });

    const result = await response.json();

    console.log("Backend response:", result);

  } catch (error) {
    console.error("Could not connect to backend:", error);
  }
});

    resetBtn.addEventListener("click", () => {
      playClickSound();
      // Move all words back to word bank
      const buttons = Array.from(answerZone.children);
      buttons.forEach(btn => {
        const word = btn.innerText;
        moveToBank(btn, word);
      });
    });

    // Web Audio API Context for generating sound effects
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBeep(freq, type, duration) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    }

    // Sound effect triggers
    function playClickSound() {
      playBeep(400, "sine", 0.05);
    }

    function playWinSound() {
      setTimeout(() => playBeep(523.25, "triangle", 0.15), 0);   // C5
      setTimeout(() => playBeep(659.25, "triangle", 0.15), 150); // E5
      setTimeout(() => playBeep(783.99, "triangle", 0.3), 300);  // G5
    }

    function playLoseSound() {
      setTimeout(() => playBeep(300, "sawtooth", 0.2), 0);
      setTimeout(() => playBeep(220, "sawtooth", 0.4), 200);
    }