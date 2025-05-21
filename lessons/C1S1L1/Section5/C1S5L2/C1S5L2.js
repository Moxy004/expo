// Slide data
    const slides = [
        
{
  type: "greetingWithImage",
  title: "Use adjectives to describe people or things.",
  subtitle: "Lesson 2",
  phrase: "Gwapo",
  translation: "(Handsome)",
  audioSrc: "3.mp3",
  imgSrc: "/Images/Handsome.jpg"
},




  {
  type: "fill-blank",
  sentence: "Si Juan ay ________.",
  correctAnswer: "Gwapo",
  options: ["Gwapo", "Hindi po", "Siya"],
  audioSrc: "3.mp3",
  correctTitle: "Awesome!",
  correctSub: "Great job!",
  incorrectTitle: "That's not right.",
  incorrectSubPrefix: "The correct answer is"
},

 {
  type: "translate-phrase",
  sourceText: "Juan is handsome",
  correctAnswer: "Si Juan ay Gwapo",
    wordBank: ["Si", "Juan", "gwapo ", "ay", "Kamusta"],
    correctTitle: "Nice work!",
  correctSub: "You nailed the translation.",
  incorrectTitle: "Oops!",
  incorrectSubPrefix: "The correct answer is"
},

];
const gradedTypes = [
  "translate-phrase",
  "fill-blank",
  "true-false",
  "image-choice",
  "speak-phrase",
  "word-choice",
  "vocab-match"
];

const interactiveWords = {
  "kamusta": {
    pron: "/ka-mús-ta/",
    ety: "cómo está",
    meaning: "How are you? / Hello!"
  },
  "ka": "",
  "salamat": "/sa-la-mat/ Arabic salām Peace, thanks, gratitude",
"hindi": "/hin-dí/ Sanskrit na + iti No, not, negative",
"opo": "/ó-po/ Honorific prefix + yes Polite yes (to elders)",
"ako": "/a-kó/ Native Austronesian I, me, first person singular",
"ikaw": "/i-káw/ Native Austronesian You (singular)",
"siya": "/shá/ Native Austronesian He, she, singular they",
"mabait": "/ma-ba-ít/ ma- (prefix) + bait Kind, nice, well-behaved",
"matalino": "/ma-ta-lí-no/ ma- + talino Intelligent, smart, wise",
"ang": "/aŋ/ Native marker Subject/topic marker (singular)",
"ito": "/i-tó/ Native This (near speaker)",
"iyon": "/i-yón/ Native That (far from both)",
"maliit": "/ma-li-ít/ ma- + liit Small, little, tiny",
"matangkad": "/ma-taŋ-kád/ ma- + tangkad Tall (height)",
"masaya": "/ma-sa-yá/ ma- + saya Happy, joyful, cheerful",
"malungkot": "/ma-luŋ-kót/ ma- + lungkot Sad, sorrowful",
"pagod": "/pa-gód/ Native Austronesian Tired, fatigued, weary",
  // Add more words as needed
};
// Filter out the original set of graded slides once
const originalGradedSlides = slides.filter(s => gradedTypes.includes(s.type));
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
const slideContainer = document.getElementById("slide-container");
const continueBtn = document.querySelector(".Continue_btn button");
const progressBar = document.querySelector(".progress_bar");
const originalSlideCount = originalGradedSlides.length;
let correctCount = 0;
let retryQueue = [];
let skipSpeakPhraseUntil = 0;
let currentSlideIndex = 0;

const continueBtnContainer = document.querySelector(".Continue_btn");


function wrapInteractiveWords(text) {
  return text.replace(/\b(\w+)\b/g, (word) => {
    const lower = word.toLowerCase();
    if (interactiveWords[lower]) {
      return `<span class="clickable-word" data-word="${lower}">${word}</span>`;
    }
    return word;
  });
}



function renderScore() {
  onScoreScreen = true;

  // Hide elements
  slideWrapper.style.display = "none";
  slideContent.style.display = "none";
  progressBar.parentElement.style.display = "none";
  continueBtnContainer.style.display = "none";
  maybeNotBtn.style.display = "none"; // 👈 Hide the "go back" button
  confirmExit.style.display = "none";

  // Show score screen
  slideContainer.style.display = "block";
  slideContainer.innerHTML = `
    <div class="score-slide">
      <h1>🎉 Great Job! 🎉</h1>
      <div class="score-box">
        <span class="score-number">${correctCount}</span>
        <span class="score-divider">/</span>
        <span class="score-total">${originalSlideCount}</span>
      </div>
      <p class="score-message">You've completed the Lesson!</p>
      <button id="finishBtn" style="
        margin-top: 2rem;
        padding: 12px 24px;
        font-size: 1.2rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
      ">Finish</button>
    </div>
  `;

  // Optional: add click handler for Finish button
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.addEventListener("click", () => {
    window.location.href = "../../home.html"; // or navigate somewhere else
  });
}


// Renders a slide based on type
function renderSlide(index) {
    if (index >= slides.length) return;

const slide = slides[index]; // <- move this after the bounds check
if (!slide) return;

// Skip speak-phrase slides for 10 minutes if the user opted out
const now = Date.now();
if (slide.type === "speak-phrase" && now < skipSpeakPhraseUntil) {
    renderSlide(index + 1);
    return;
}

slideContainer.innerHTML = ""; 

    // Update progress bar
    progressBar.value = ((index + 1) / slides.length) * 100;

    // Vocabulary Slide
    if (slide.type === "vocab") {
        continueBtnContainer.style.display = "flex";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <h1 class="title">${slide.title}</h1>
        <h2 class="meaning_text">Tap on the word to view its definition.</h2>
        <div id="words-buttons" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 2rem;"></div>
    `;

    const buttonsContainer = wrapper.querySelector("#words-buttons");
    const meaningText = wrapper.querySelector(".meaning_text");

    slide.words.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = item.word;

        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            const allBtns = wrapper.querySelectorAll(".btn");
            allBtns.forEach(b => b.classList.remove("active"));

            // Add active class to clicked button
            btn.classList.add("active");

            // Update meaning text
            meaningText.innerText = `${item.word}: ${item.meaning}`;

            // Play corresponding audio
            if (item.audioSrc) {
                playAudio(item.audioSrc);
            }
        });

        buttonsContainer.appendChild(btn);
    });

    slideContainer.appendChild(wrapper);
}

    // Greeting Slide
else if (slide.type === "greeting") {
  continueBtnContainer.style.display = "flex";

  // Wrap interactive words in the phrase
  const phraseHTML = wrapInteractiveWords(slide.phrase || "");

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative"; // allow absolute word dialog placement
  wrapper.innerHTML = `
      <h3 class="title">${slide.subtitle}</h3>
      <h1 class="title">${slide.title}</h1>
      <div class="audio-section" style="text-align: center; margin-top: 2rem;">
          <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
              <img src="../vms/vol.png" alt="Play audio" />
          </button>
          <h2 class="interactive-phrase" style="color:#008cdd; margin-top: 1rem;">${phraseHTML}</h2>
          <p style="color:#008cdd;">${slide.translation}</p>
      </div>
  `;
  slideContainer.appendChild(wrapper);

  // Add event listeners for any clickable words
  wrapper.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.word;

      // If this word's dialog is already open, remove it (toggle off)
      const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);
      if (existing) {
        existing.remove();
        return;
      }

      // Remove any other dialog
      wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

      // Create the floating dialog
      const dialog = document.createElement("div");
dialog.className = "word-dialog";
dialog.dataset.word = key;

const wordData = interactiveWords[key];

if (typeof wordData === "string") {
  // fallback for legacy format
  dialog.innerText = wordData;
} else {
  dialog.innerHTML = `
    <div style="color: #ff9900; font-weight: bold;">
      ${wordData.pron} ${wordData.ety}
    </div>
    <div style="color: #333;">${wordData.meaning}</div>
  `;
}




      // Position the dialog under the clicked word
      const wordRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      dialog.style.left = `${wordRect.left - wrapRect.left}px`;
      dialog.style.top = `${wordRect.bottom - wrapRect.top + 4}px`;

      wrapper.appendChild(dialog);
    });
  });
}

else if (slide.type === "greetingWithImage") {
  continueBtnContainer.style.display = "flex";

  const phraseHTML = wrapInteractiveWords(slide.phrase || "");

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.innerHTML = `
    <h3 class="title">${slide.subtitle}</h3>
    <h1 class="title" style="font-size: 1.5rem">${slide.title}</h1>
    <div class="audio-section" style="text-align: center; margin-top: 2rem;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
        <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')" style="flex-shrink: 0;">
          <img src="../vms/vol.png" alt="Play audio" />
        </button>
        <h2 class="interactive-phrase" style="color:#008cdd; margin: 0;">
          ${phraseHTML}
        </h2>
      </div>
      <p style="color:#008cdd; margin-top: 0.5rem;">${slide.translation}</p>
      ${slide.imgSrc ? `<img src="${slide.imgSrc}" alt="Visual aid" class="greeting-image">` : ""}
    </div>
  `;
  slideContainer.appendChild(wrapper);

  wrapper.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.word;
      const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);
      if (existing) {
        existing.remove();
        return;
      }

      // Close any other open dialogs
      wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

      const dialog = document.createElement("div");
      dialog.className = "word-dialog";
      dialog.dataset.word = key;

      const wordData = interactiveWords[key];

      if (typeof wordData === "string") {
        dialog.innerText = wordData;
      } else if (wordData) {
        dialog.innerHTML = `
          <div class="dialog-top" style="color: #ff9900; font-weight: bold;">
            ${wordData.pron || ""} ${wordData.ety || ""}
          </div>
          <div class="dialog-bottom">
            ${wordData.meaning || ""}
          </div>
        `;
      } else {
        dialog.innerText = "No definition available.";
      }

      // Position below the clicked word
      const wordRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      dialog.style.left = `${wordRect.left - wrapRect.left}px`;
      dialog.style.top = `${wordRect.bottom - wrapRect.top + 4}px`;

      wrapper.appendChild(dialog);
    });
  });
}




else if (slide.type === "fill-blank") {
  continueBtnContainer.style.display = "none";

  // 1️⃣ Wrap interactive words in the sentence
  const sentenceHTML = wrapInteractiveWords(slide.sentence || "");

  // 2️⃣ Create and inject the slide DOM
  const wrapper = document.createElement("div");
  wrapper.className = "fill-blank-slide";
  wrapper.style.position = "relative";
  wrapper.innerHTML = `
    <h1 class="title">Fill in the Blanks</h1>
    <div class="audio-section">
      <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
        <img src="../vms/vol.png" alt="Play audio" />
      </button>
    </div>
    <h2 class="sentence">${sentenceHTML}</h2>
    <div class="option-buttons">
      ${slide.options.map(opt => `<button class="blank-option">${opt}</button>`).join("")}
    </div>
    <div class="custom-bottom-dialog hidden">
      <div class="left">
        <h3 class="dialog-title"></h3>
        <p class="dialog-sub"></p>
      </div>
      <div class="right">
        <button class="custom-continue">CONTINUE ➤</button>
      </div>
    </div>
  `;
  slideContainer.appendChild(wrapper);

  // 3️⃣ Attach floating pop-over handlers to interactive words
  wrapper.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.word;

      // Toggle off if already open
      const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);
      if (existing) {
        existing.remove();
        return;
      }

      // Remove any other open dialog
      wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

      const dialog = document.createElement("div");
      dialog.className = "word-dialog";
      dialog.dataset.word = key;

      const wordData = interactiveWords[key];
      if (typeof wordData === "string") {
        dialog.innerText = wordData;
      } else if (wordData) {
        dialog.innerHTML = `
          <div class="dialog-top" style="color: #ff9900; font-weight: bold;">
            ${wordData.pron || ""} ${wordData.ety || ""}
          </div>
          <div class="dialog-bottom">
            ${wordData.meaning || ""}
          </div>
        `;
      } else {
        dialog.innerText = "No definition available.";
      }

      // Position the dialog under the clicked word
      const wordRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      dialog.style.left = `${wordRect.left - wrapRect.left}px`;
      dialog.style.top = `${wordRect.bottom - wrapRect.top + 4}px`;

      wrapper.appendChild(dialog);
    });
  });

  // 4️⃣ Answer checking logic
  const buttons = wrapper.querySelectorAll(".blank-option");
  const dialogBox = wrapper.querySelector(".custom-bottom-dialog");
  const continueBtn = wrapper.querySelector(".custom-continue");
  const titleEl = wrapper.querySelector(".dialog-title");
  const subEl = wrapper.querySelector(".dialog-sub");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Disable all options
      buttons.forEach(b => b.disabled = true);
      const isCorrect = btn.innerText === slide.correctAnswer;
      dialogBox.classList.remove("is-wrong");

      if (isCorrect) {
        if (gradedTypes.includes(slide.type) && !slide._counted) {
          correctCount++;
          slide._counted = true;
        }
        playCorrectSound();
        btn.classList.add("correct");
        titleEl.innerText = slide.correctTitle || "Awesome!";
        subEl.innerText = slide.correctSub || "";
      } else {
        playWrongSound();
        if (!slide.retryCount || slide.retryCount < 1) {
          retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
        }
        btn.classList.add("incorrect");
        dialogBox.classList.add("is-wrong");
        titleEl.innerText = slide.incorrectTitle || "That's not right.";
        subEl.innerText = `${slide.incorrectSubPrefix || "The correct answer is"} "${slide.correctAnswer}".`;
      }

      dialogBox.classList.remove("hidden");
    });
  });

  continueBtn.addEventListener("click", goToNextSlide);
}


else if (slide.type === "translate-phrase") {
  continueBtnContainer.style.display = "none";

  const sourceTextHTML = wrapInteractiveWords(slide.sourceText || "");

  const wrapper = document.createElement("div");
  wrapper.className = "translate-phrase-slide";
  wrapper.style.position = "relative";
  wrapper.innerHTML = `
    <h1 class="title">Translate this sentence</h1>
    <h2 class="sentence">${sourceTextHTML}</h2>
    <div class="selected-output"></div>
    <div class="wordbank-buttons">
      ${shuffleArray(slide.wordBank).map((word, index) =>
        `<button class="wordbank-btn" data-index="${index}">${word}</button>`
      ).join("")}
    </div>
    <div class="translate-phrase-controls">
      <button class="translate-phrase-clear-btn">Clear</button>
      <button class="translate-phrase-confirm-btn">Confirm</button>
    </div>
    <div class="custom-bottom-dialog hidden">
      <div class="left">
        <h3 class="dialog-title"></h3>
        <p class="dialog-sub"></p>
      </div>
      <div class="right">
        <button class="custom-continue">CONTINUE ➤</button>
      </div>
    </div>
  `;
  slideContainer.appendChild(wrapper);

  // 🧠 Floating pop-up for interactive words
  wrapper.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.word;

      const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);
      if (existing) {
        existing.remove();
        return;
      }

      wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

      const dialog = document.createElement("div");
      dialog.className = "word-dialog";
      dialog.dataset.word = key;

      const wordData = interactiveWords[key];
      if (typeof wordData === "string") {
        dialog.innerText = wordData;
      } else if (wordData) {
        dialog.innerHTML = `
          <div class="dialog-top" style="color: #ff9900; font-weight: bold;">
            ${wordData.pron || ""} ${wordData.ety || ""}
          </div>
          <div class="dialog-bottom">
            ${wordData.meaning || ""}
          </div>
        `;
      } else {
        dialog.innerText = "No definition available.";
      }

      const wordRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      dialog.style.left = `${wordRect.left - wrapRect.left}px`;
      dialog.style.top = `${wordRect.bottom - wrapRect.top + 6}px`;

      wrapper.appendChild(dialog);
    });
  });

  // 📌 Selection & grading logic
  const selectedOutput = wrapper.querySelector(".selected-output");
  const dialogBox = wrapper.querySelector(".custom-bottom-dialog");
  const continueBtn = wrapper.querySelector(".custom-continue");
  const dialogTitle = wrapper.querySelector(".dialog-title");
  const dialogSub = wrapper.querySelector(".dialog-sub");
  const clearBtn = wrapper.querySelector(".translate-phrase-clear-btn");
  const confirmBtn = wrapper.querySelector(".translate-phrase-confirm-btn");
  const wordButtons = wrapper.querySelectorAll(".wordbank-btn");

  const selectedWords = [];
  const selectedIndices = new Set();

  function updateSelectedOutput() {
    selectedOutput.innerText = selectedWords.join(" ");
  }

  function checkAnswer() {
    const userAnswer = selectedWords.join(" ").trim();
    const isCorrect = userAnswer === slide.correctAnswer;
    dialogBox.classList.remove("is-wrong");

    if (isCorrect) {
      if (gradedTypes.includes(slide.type) && !slide._counted) {
        correctCount++;
        slide._counted = true;
      }
      playCorrectSound();
      dialogTitle.innerText = slide.correctTitle || "Well done!";
      dialogSub.innerText = slide.correctSub || "";
      selectedOutput.classList.add("correct");
      selectedOutput.classList.remove("incorrect");
    } else {
      playWrongSound();
      if (!slide.retryCount || slide.retryCount < 1) {
        retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
      }
      dialogBox.classList.add("is-wrong");
      dialogTitle.innerText = slide.incorrectTitle || "Not quite.";
      dialogSub.innerText = `${slide.incorrectSubPrefix || "Correct answer:"} "${slide.correctAnswer}"`;
      selectedOutput.classList.add("incorrect");
      selectedOutput.classList.remove("correct");
    }

    dialogBox.classList.remove("hidden");

    wordButtons.forEach(btn => {
      const word = btn.innerText;
      const part = slide.correctAnswer.split(" ").includes(word);
      btn.disabled = true;

      if (part) {
        btn.classList.add(isCorrect ? "correct-btn" : "incorrect-btn");
      } else {
        btn.classList.add("disabled-btn");
      }
    });

    clearBtn.disabled = true;
    clearBtn.classList.add("disabled-btn");
    confirmBtn.disabled = true;
    confirmBtn.classList.add("disabled-btn");
  }

  wordButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      if (selectedIndices.has(idx)) return;
      selectedIndices.add(idx);
      selectedWords.push(btn.innerText);
      btn.disabled = true;
      updateSelectedOutput();
    });
  });

  clearBtn.addEventListener("click", () => {
    selectedWords.length = 0;
    selectedIndices.clear();
    wordButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("disabled-btn", "correct-btn", "incorrect-btn");
    });
    updateSelectedOutput();
    dialogBox.classList.add("hidden");
    clearBtn.disabled = false;
    clearBtn.classList.remove("disabled-btn");
    confirmBtn.disabled = false;
    confirmBtn.classList.remove("disabled-btn");
  });

  confirmBtn.addEventListener("click", checkAnswer);
  continueBtn.addEventListener("click", goToNextSlide);
}











else if (slide.type === "true-false") {
  continueBtnContainer.style.display = "none";

  const sentenceHTML = wrapInteractiveWords(slide.sentence || "");

  const wrapper = document.createElement("div");
  wrapper.className = "fill-blank-slide";
  wrapper.style.position = "relative";
  wrapper.innerHTML = `
    <h1 class="title">True or False</h1>
    <div class="audio-section">
      <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
        <img src="../vms/vol.png" alt="Play audio" />
      </button>
    </div>
    <h3 class="sentence small-sentence">${sentenceHTML}</h3>
    <div class="option-buttons">
      ${slide.options.map(opt => `<button class="blank-option">${opt}</button>`).join("")}
    </div>
    <div class="custom-bottom-dialog hidden">
      <div class="left">
        <h3 class="dialog-title"></h3>
        <p class="dialog-sub"></p>
      </div>
      <div class="right">
        <button class="custom-continue">CONTINUE ➤</button>
      </div>
    </div>
  `;
  slideContainer.appendChild(wrapper);

  // 🧠 Interactive word logic
  wrapper.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.word;
      const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);
      if (existing) {
        existing.remove();
        return;
      }
      wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

      const dialog = document.createElement("div");
      dialog.className = "word-dialog";
      dialog.dataset.word = key;

      const wordData = interactiveWords[key];
      if (typeof wordData === "string") {
        dialog.innerText = wordData;
      } else if (wordData) {
        dialog.innerHTML = `
          <div class="dialog-top" style="color: #ff9900; font-weight: bold;">
            ${wordData.pron || ""} ${wordData.ety || ""}
          </div>
          <div class="dialog-bottom">
            ${wordData.meaning || ""}
          </div>
        `;
      } else {
        dialog.innerText = "No definition available.";
      }

      const wordRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      dialog.style.left = `${wordRect.left - wrapRect.left}px`;
      dialog.style.top = `${wordRect.bottom - wrapRect.top + 4}px`;

      wrapper.appendChild(dialog);
    });
  });

  // ✅ True/False answer logic
  const buttons = wrapper.querySelectorAll(".blank-option");
  const dialogBox = wrapper.querySelector(".custom-bottom-dialog");
  const continueBtn = wrapper.querySelector(".custom-continue");
  const titleEl = wrapper.querySelector(".dialog-title");
  const subEl = wrapper.querySelector(".dialog-sub");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.disabled = true);
      const isCorrect = btn.innerText === slide.correctAnswer;
      dialogBox.classList.remove("is-wrong");

      if (isCorrect) {
        playCorrectSound();
        btn.classList.add("correct");
        titleEl.innerText = slide.correctTitle || "Awesome!";
        subEl.innerText = slide.correctSub || "";
      } else {
        playWrongSound();
        if (!slide.retryCount || slide.retryCount < 1) {
          retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
        }
        btn.classList.add("incorrect");
        dialogBox.classList.add("is-wrong");
        titleEl.innerText = slide.incorrectTitle || "That's not right.";
        subEl.innerText = `${slide.incorrectSubPrefix || "The correct answer is"} "${slide.correctAnswer}".`;
      }

      dialogBox.classList.remove("hidden");
    });
  });

  continueBtn.addEventListener("click", goToNextSlide);
}



else if (slide.type === "word-choice") {
  continueBtnContainer.style.display = "none";

  // Shuffle text options
  const optionObjects = slide.options.map((word, index) => ({
    word,
    isCorrect: index === slide.correctWordIndex,
  }));

  for (let i = optionObjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionObjects[i], optionObjects[j]] = [optionObjects[j], optionObjects[i]];
  }

  const newCorrectWordIndex = optionObjects.findIndex(opt => opt.isCorrect);

  const wrapper = document.createElement("div");
  wrapper.className = "word-choice-slide";
  wrapper.style.position = "relative";
  wrapper.innerHTML = `
    <h1 class="title">${slide.title}</h1>
    <div class="audio-sentence">
      <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
        <img src="../vms/vol.png" alt="Play audio" />
      </button>
      <div class="sentence-image">
        <img src="${slide.imageSrc}" alt="Sentence Image" />
      </div>
    </div>
    <div class="word-grid">
      ${optionObjects.map((opt, i) => `
        <button class="word-option" data-index="${i}">
          ${opt.word}
        </button>
      `).join("")}
    </div>
    <div class="custom-bottom-dialog hidden">
      <div class="left">
        <h3 class="dialog-title"></h3>
        <p class="dialog-sub"></p>
      </div>
      <div class="right">
        <button class="custom-continue">CONTINUE ➤</button>
      </div>
    </div>
  `;

  slideContainer.appendChild(wrapper);

  // Core logic
  const wordButtons = wrapper.querySelectorAll(".word-option");
  const dialog = wrapper.querySelector(".custom-bottom-dialog");
  const continueBtn = wrapper.querySelector(".custom-continue");
  const dialogTitle = wrapper.querySelector(".dialog-title");
  const dialogSub = wrapper.querySelector(".dialog-sub");

  wordButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      wordButtons.forEach(b => b.disabled = true);
      const isCorrect = index === newCorrectWordIndex;
      dialog.classList.remove("is-wrong");

      if (isCorrect) {
        playCorrectSound();
        if (gradedTypes.includes(slide.type) && !slide._counted) {
          correctCount++;
          slide._counted = true;
        }
        btn.classList.add("correct");
        dialogTitle.innerText = slide.correctTitle || "Great job!";
        dialogSub.innerText = slide.correctSub || "";
      } else {
        playWrongSound();
        if (!slide.retryCount || slide.retryCount < 1) {
          retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
        }
        btn.classList.add("incorrect");
        dialog.classList.add("is-wrong");
        dialogTitle.innerText = slide.incorrectTitle || "Oops!";
        dialogSub.innerText = `${slide.incorrectSubPrefix || "The correct word for this sentence is"} "${optionObjects[newCorrectWordIndex].word}".`;
        wordButtons[newCorrectWordIndex].classList.add("correct");
      }

      dialog.classList.remove("hidden");
    });
  });

  continueBtn.addEventListener("click", goToNextSlide);
}


else if (slide.type === "image-choice") {
  continueBtnContainer.style.display = "none";

  // Shuffle image options
  const optionObjects = slide.options.map((imgSrc, index) => ({
    imgSrc,
    isCorrect: index === slide.correctImageIndex,
  }));

  for (let i = optionObjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionObjects[i], optionObjects[j]] = [optionObjects[j], optionObjects[i]];
  }

  const newCorrectImageIndex = optionObjects.findIndex(opt => opt.isCorrect);

  // Wrap interactive words in the word prompt
  const wordHTML = wrapInteractiveWords(slide.word || "");

  const wrapper = document.createElement("div");
  wrapper.className = "image-choice-slide";
  wrapper.style.position = "relative"; // required for absolute dialogs
  wrapper.innerHTML = `
    <h1 class="title">${slide.title}</h1>
    <div class="audio-sentence">
      <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
        <img src="../vms/vol.png" alt="Play audio" />
      </button>
      <h2 class="sentence">${wordHTML}</h2>
    </div>
    <div class="image-grid">
      ${optionObjects.map((opt, i) => `
        <button class="image-option" data-index="${i}">
          <img src="${opt.imgSrc}" alt="Option ${i + 1}" />
        </button>
      `).join("")}
    </div>
    <div class="custom-bottom-dialog hidden">
      <div class="left">
        <h3 class="dialog-title"></h3>
        <p class="dialog-sub"></p>
      </div>
      <div class="right">
        <button class="custom-continue">CONTINUE ➤</button>
      </div>
    </div>
  `;

  slideContainer.appendChild(wrapper);

  // Add pop-up definitions for interactive words (same logic as greetingWithImage)
  wrapper.querySelectorAll(".clickable-word").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.word;
      const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);
      if (existing) {
        existing.remove();
        return;
      }

      // Close any other open dialogs
      wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

      const dialog = document.createElement("div");
      dialog.className = "word-dialog";
      dialog.dataset.word = key;

      const wordData = interactiveWords[key];

      if (typeof wordData === "string") {
        dialog.innerText = wordData;
      } else if (wordData) {
        dialog.innerHTML = `
          <div class="dialog-top" style="color: #ff9900; font-weight: bold;">
            ${wordData.pron || ""} ${wordData.ety || ""}
          </div>
          <div class="dialog-bottom">
            ${wordData.meaning || ""}
          </div>
        `;
      } else {
        dialog.innerText = "No definition available.";
      }

      // Position below the clicked word
      const wordRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      dialog.style.position = "absolute";
      dialog.style.left = `${wordRect.left - wrapRect.left}px`;
      dialog.style.top = `${wordRect.bottom - wrapRect.top + 4}px`;

      wrapper.appendChild(dialog);
    });
  });

  // Core logic for image buttons and bottom dialog feedback
  const imageButtons = wrapper.querySelectorAll(".image-option");
  const dialog = wrapper.querySelector(".custom-bottom-dialog");
  const continueBtn = wrapper.querySelector(".custom-continue");
  const dialogTitle = wrapper.querySelector(".dialog-title");
  const dialogSub = wrapper.querySelector(".dialog-sub");

  imageButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      imageButtons.forEach(b => b.disabled = true);
      const isCorrect = index === newCorrectImageIndex;
      dialog.classList.remove("is-wrong");

      if (isCorrect) {
        playCorrectSound();
        if (gradedTypes.includes(slide.type) && !slide._counted) {
          correctCount++;
          slide._counted = true;
        }
        btn.classList.add("correct");
        dialogTitle.innerText = slide.correctTitle || "Awesome!";
        dialogSub.innerText = slide.correctSub || "";
      } else {
        playWrongSound();
        if (!slide.retryCount || slide.retryCount < 1) {
          retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
        }
        btn.classList.add("incorrect");
        dialog.classList.add("is-wrong");
        dialogTitle.innerText = slide.incorrectTitle || "That's not right.";
        dialogSub.innerText = `${slide.incorrectSubPrefix || "The correct image for"} "${slide.word}" is shown above.`;
        imageButtons[newCorrectImageIndex].classList.add("correct");
      }

      dialog.classList.remove("hidden");
    });
  });

  continueBtn.addEventListener("click", goToNextSlide);
}





else if (slide.type === "speak-phrase") {
    continueBtnContainer.style.display = "none";

    const wrapper = document.createElement("div");
    wrapper.className = "speak-phrase-slide";
    wrapper.style.position = "relative"; // Important for absolute word popups
    wrapper.innerHTML = `
        <h1 class="speak-phrase-title">Speak this sentence below</h1>
        <div class="speak-phrase-container">
            <button class="audio-btn">
                <img src="../vms/vol.png" alt="Play audio" />
            </button>
            <span class="speak-phrase-target highlighted-text">Loading...</span>
        </div>
        <button class="speak-phrase-mic-btn">🎤 CLICK AND HOLD TO SPEAK</button>
        <button class="speak-phrase-skip-btn">I can't speak now</button>
        <div class="custom-bottom-dialog hidden">
            <div class="left">
                <h3 class="dialog-title"></h3>
                <p class="dialog-sub"></p>
            </div>
        </div>
    `;
    slideContainer.appendChild(wrapper);

    const targetSpan = wrapper.querySelector(".speak-phrase-target");

    // Inject phrase with interactive clickable words
    const phraseHTML = wrapInteractiveWords(slide.phrase || "");
    targetSpan.innerHTML = phraseHTML;

    // Enable interactive word popup behavior with dialog-top/dialog-bottom
    wrapper.querySelectorAll(".clickable-word").forEach(el => {
        el.addEventListener("click", () => {
            const key = el.dataset.word;
            const existing = wrapper.querySelector(`.word-dialog[data-word="${key}"]`);

            // Toggle dialog: close if already open
            if (existing) {
                existing.remove();
                return;
            }

            // Close any other dialogs
            wrapper.querySelectorAll(".word-dialog").forEach(d => d.remove());

            const dialog = document.createElement("div");
            dialog.className = "word-dialog";
            dialog.dataset.word = key;

            const wordData = interactiveWords[key];

            if (typeof wordData === "string") {
                dialog.innerText = wordData;
            } else if (wordData) {
                dialog.innerHTML = `
                    <div class="dialog-top" style="color: #ff9900; font-weight: bold;">
                        ${wordData.pron || ""} ${wordData.ety || ""}
                    </div>
                    <div class="dialog-bottom">
                        ${wordData.meaning || ""}
                    </div>
                `;
            } else {
                dialog.innerText = "No definition available.";
            }

            // Position directly below clicked word
            const wordRect = el.getBoundingClientRect();
            const wrapRect = wrapper.getBoundingClientRect();
            dialog.style.position = "absolute";
            dialog.style.left = `${wordRect.left - wrapRect.left}px`;
            dialog.style.top = `${wordRect.bottom - wrapRect.top + 6}px`;

            wrapper.appendChild(dialog);
        });
    });

    const spokenText = wrapper.querySelector(".speak-phrase-spoken");
    const micButton = wrapper.querySelector(".speak-phrase-mic-btn");
    const audioButton = wrapper.querySelector(".audio-btn");
    const dialog = wrapper.querySelector(".custom-bottom-dialog");
    const dialogTitle = wrapper.querySelector(".dialog-title");
    const dialogSub = wrapper.querySelector(".dialog-sub");

    const currentPhrase = slide.phrase;
    let isRecognizing = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "tl-PH";
    recognition.continuous = false;
    recognition.interimResults = true;

    const skipBtn = wrapper.querySelector(".speak-phrase-skip-btn");
    skipBtn.addEventListener("click", () => {
        skipSpeakPhraseUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
        goToNextSlide();
    });

    audioButton.onclick = () => {
        const utterance = new SpeechSynthesisUtterance(currentPhrase);
        utterance.lang = "tl-PH";
        speechSynthesis.speak(utterance);
    };

    micButton.addEventListener("mousedown", () => {
        if (spokenText) spokenText.textContent = "Listening...";
        recognition.start();
        isRecognizing = true;
    });

    micButton.addEventListener("mouseup", () => {
        if (isRecognizing) {
            recognition.stop();
            isRecognizing = false;
        }
    });

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }

        if (spokenText) spokenText.textContent = transcript;

        const spokenWords = transcript.trim().toLowerCase().split(/\s+/);
        const targetWords = currentPhrase.trim().split(/\s+/);

        let highlighted = "";
        for (let i = 0; i < targetWords.length; i++) {
            const targetWord = targetWords[i];
            const spokenWord = spokenWords[i];
            if (spokenWord && spokenWord.toLowerCase() === targetWord.toLowerCase()) {
                highlighted += `<span class="matched">${targetWord}</span> `;
            } else {
                highlighted += `<span>${targetWord}</span> `;
            }
        }
        targetSpan.innerHTML = highlighted.trim();

        const isCorrect = transcript.trim().toLowerCase() === currentPhrase.trim().toLowerCase();

        dialog.classList.remove("is-wrong", "hidden");

        if (isCorrect) {
            if (gradedTypes.includes(slide.type) && !slide._counted) {
                correctCount++;
                slide._counted = true;
            }
            playCorrectSound();
            dialogTitle.innerText = slide.correctTitle || "Great job!";
            dialogSub.innerText = slide.correctSub || "You said it correctly!";
        } else {
            playWrongSound();
            if (!slide.retryCount || slide.retryCount < 1) {
                retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
            }
            dialog.classList.add("is-wrong");
            dialogTitle.innerText = slide.incorrectTitle || "Not quite right.";
            dialogSub.innerText = slide.incorrectSub || "Try to say the full sentence clearly.";
        }

        setTimeout(goToNextSlide, 1500);
    };
}




else if (slide.type === "vocab-match") {
  continueBtnContainer.style.display = "none"; // hide global continue by default

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper_questions";
  wrapper.innerHTML = `
      <h1 class="title">${slide.title}</h1>
      <div class="main_question">
          <h2 class="meaning_text">Tap to match the word with its definition.</h2>
          <div class="match-buttons">
              <div class="buttons_A"></div>
              <div class="buttons_B"></div>
          </div>
      </div>

      <div class="custom-bottom-dialog hidden">
        <div class="left">
          <h3 class="dialog-title">Well done!</h3>
          <p class="dialog-sub">You matched all words correctly.</p>
        </div>
        <div class="right">
          <button class="custom-continue">CONTINUE ➤</button>
        </div>
      </div>
  `;
  slideContainer.appendChild(wrapper);

  const buttonsA = wrapper.querySelector('.buttons_A');
  const buttonsB = wrapper.querySelector('.buttons_B');
  const dialog = wrapper.querySelector('.custom-bottom-dialog');
  const continueBtn = wrapper.querySelector('.custom-continue');

  // Shuffle pairs separately for A and B
  let shuffledA = [...slide.pairs];
  let shuffledB = [...slide.pairs];
  shuffle(shuffledA);
  shuffle(shuffledB);

  buttonsA.innerHTML = '';
  buttonsB.innerHTML = '';

  // Render A buttons
  shuffledA.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'option-A';
    btn.innerText = item.A;
    btn.dataset.value = item.A;
    btn.dataset.audio = item.audioA || '';
    buttonsA.appendChild(btn);
  });

  // Render B buttons
  shuffledB.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'option-B';
    btn.innerText = item.B;
    btn.dataset.value = item.B;
    btn.dataset.audio = item.audioB || '';
    buttonsB.appendChild(btn);
  });

  let selectedA = null;
  let selectedB = null;

  // Track how many correct pairs matched
  let correctMatches = 0;
  const totalPairs = slide.pairs.length;

  // Add click event listeners for option A
  wrapper.querySelectorAll('.option-A').forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      selectedA = button.dataset.value;
      wrapper.querySelectorAll('.option-A').forEach(b => b.classList.remove('selected', 'clicked'));
      button.classList.add('selected', 'clicked');

      if (button.dataset.audio) {
        playAudio(button.dataset.audio);
      }

      checkMatch();
    });
  });

  // Add click event listeners for option B
  wrapper.querySelectorAll('.option-B').forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      selectedB = button.dataset.value;
      wrapper.querySelectorAll('.option-B').forEach(b => b.classList.remove('selected', 'clicked'));
      button.classList.add('selected', 'clicked');

      if (button.dataset.audio) {
        playAudio(button.dataset.audio);
      }

      checkMatch();
    });
  });

  function checkMatch() {
    if (selectedA && selectedB) {
      const match = slide.pairs.find(p => p.A === selectedA && p.B === selectedB);
      const btnA = wrapper.querySelector('.option-A.selected');
      const btnB = wrapper.querySelector('.option-B.selected');

      if (match) {
        btnA.classList.add('correct');
        btnB.classList.add('correct');
        btnA.disabled = true;
        btnB.disabled = true;

        playCorrectSound();

        if (gradedTypes.includes(slide.type) && !slide._counted) {
          correctCount++;
          slide._counted = true;
        }

        correctMatches++;

        // Check if all pairs matched
        if (correctMatches === totalPairs) {
          // Show dialog and continue button
          dialog.classList.remove('hidden');
          continueBtnContainer.style.display = "none"; // keep global continue hidden
        }
      } else {
        btnA.classList.add('incorrect');
        btnB.classList.add('incorrect');
        playWrongSound();

        setTimeout(() => {
          btnA.classList.remove('incorrect');
          btnB.classList.remove('incorrect');
        }, 1000);
      }

      // Reset selections
      wrapper.querySelectorAll('.option-A').forEach(b => b.classList.remove('selected', 'clicked'));
      wrapper.querySelectorAll('.option-B').forEach(b => b.classList.remove('selected', 'clicked'));
      selectedA = null;
      selectedB = null;
    }
  }

  continueBtn.addEventListener('click', () => {
    dialog.classList.add('hidden');
    goToNextSlide();
  });
}





}
function shuffle(array) {   
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}
// Show next slide on continue
continueBtn.addEventListener("click", () => {
    stopEffectAudio()
    stopAudio();
    currentSlideIndex++;

    if (currentSlideIndex < slides.length) {
        renderSlide(currentSlideIndex);

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else if (retryQueue.length > 0) {
        slides.push(...retryQueue);
        retryQueue = [];
        renderSlide(currentSlideIndex); // Re-render same index since slides now extended

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else {
          renderScore();
        continueBtn.disabled = true;
        continueBtn.innerText = "Finished";
    }
});


// Initial render
renderSlide(currentSlideIndex);


const goBackBtn = document.getElementById("go-back-btn");
const confirmExit = document.getElementById("confirm-exit");
const slideWrapper = document.querySelector(".wrapper");
const slideContent = document.getElementById("slide-container");


goBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Hide all slide-related content
    slideWrapper.style.display = "none";
    slideContent.style.display = "none";
    continueBtnContainer.style.display = "none";

    // Show confirmation screen
    confirmExit.style.display = "flex";
});

const maybeNotBtn = confirmExit.querySelector("button:nth-child(3)");


let effectAudio = null;

function playCorrectSound() {
    stopEffectAudio();
    effectAudio = new Audio('../vms/correct.mp3');
    effectAudio.play();
}

function playWrongSound() {
    stopEffectAudio();
    effectAudio = new Audio('../vms/wrong.mp3');
    effectAudio.play(); 
}

function stopEffectAudio() {
    if (effectAudio && !effectAudio.paused) {
        effectAudio.pause();
        effectAudio.currentTime = 0;
    }
}


function goToNextSlide() {
    stopEffectAudio();
    stopAudio();
    currentSlideIndex++;

    if (currentSlideIndex < slides.length) {
        renderSlide(currentSlideIndex);

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else if (retryQueue.length > 0) {
        slides.push(...retryQueue);
        retryQueue = [];
        renderSlide(currentSlideIndex);

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else {
          renderScore();
        const globalContinue = document.querySelector(".Continue_btn button");
        globalContinue.disabled = true;
        globalContinue.innerText = "Finished";
    }
}

maybeNotBtn.addEventListener("click", () => {
    // Show previous UI
    slideWrapper.style.display = "flex";
    slideContent.style.display = "flex";

    // Only show continueBtnContainer if current slide uses it
    const currentSlide = slides[currentSlideIndex];
    const shouldShowContinue = !["fill-blank", "true-false", "speak-phrase", "image-choice", "translate-phrase", "word-choice", "vocab-match"].includes(currentSlide.type);
    continueBtnContainer.style.display = shouldShowContinue ? "flex" : "none";

    // Hide confirmation
    confirmExit.style.display = "none";
});

let currentAudio = null;  // Variable to hold the current audio


function stopAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;  // Optionally reset the audio to the beginning
    }
}
function playAudio(audioSrc) {
    stopAudio();
    currentAudio = new Audio(audioSrc);
    currentAudio.play();
}




let isMuted = false; // Variable to track mute state

// Function to toggle mute state
function toggleMute() {
    isMuted = !isMuted;

    // Change the mute icon image
    const muteIcon = document.getElementById("mute-icon");
    if (isMuted) {
        muteIcon.src = "muted.png"; // Muted icon
        muteAudio(); // Call to mute audio
    } else {
        muteIcon.src = "sound.png"; // Sound icon
        unmuteAudio(); // Call to unmute audio
    }
}

// Mute all audio
function muteAudio() {
    const audios = document.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.muted = true;
    });
}

// Unmute all audio
function unmuteAudio() {
    const audios = document.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.muted = false;
    });
}

// Add event listener to mute icon
const muteIcon = document.getElementById("mute-icon");
muteIcon.addEventListener("click", toggleMute);