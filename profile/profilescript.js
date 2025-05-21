window.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.querySelector('.edit-btn');

    // Track progress scores
    const lessonScores = {
      C1S1L1: 0,
      C1S1L2: 0,
      C1S1L3: 0
    };

    customElements.whenDefined('circle-progress').then(() => {
      editBtn.addEventListener('click', () => {
        const currentList = document.querySelector('.current-lesson ul');
        const finishedList = document.querySelector('.finished-lessons ul');

        const lessonItem = currentList.querySelector('li:not(.locked)');
        if (!lessonItem) return;

        const lessonId = lessonItem.dataset.lessonId;
        const progress = lessonItem.querySelector('circle-progress');
        //Note that when pressing the edit button the progress will increse its progress and this is just a place holder so change it if needed
        // Simulate score update (e.g., correct answer from quiz)
        lessonScores[lessonId] = Math.min(lessonScores[lessonId] + 25, 100); // +25 per click
        progress.value = lessonScores[lessonId];

        if (lessonScores[lessonId] === 100) {
          // Move lesson to finished
          currentList.removeChild(lessonItem);

          const finishedItem = document.createElement('li');
          const newProgress = document.createElement('circle-progress');
          newProgress.setAttribute('class', 'progress');
          newProgress.setAttribute('value', '100');
          newProgress.setAttribute('max', '100');
          newProgress.setAttribute('text-format', 'percent');

          const textWrapper = lessonItem.querySelector('.wrappser').cloneNode(true);
          finishedItem.appendChild(newProgress);
          finishedItem.appendChild(textWrapper);

          const endMarker = finishedList.querySelector('.end-list');
          finishedList.insertBefore(finishedItem, endMarker);

          // Unlock next lesson
          const nextLocked = currentList.querySelector('.locked');
          if (nextLocked) {
            nextLocked.classList.remove('locked');
          }
        }
      });
    });
  });

  // Open dialog on edit click
document.querySelector('.edit-btn').addEventListener('click', function () {
  document.querySelector('.avatar-dialog').classList.remove('hidden');
});

// Close dialog on X click
document.querySelector('.close-dialog').addEventListener('click', function () {
  document.querySelector('.avatar-dialog').classList.add('hidden');
});

// Tab switching logic
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    tabContents.forEach(content => content.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
  });
});

document.querySelector('.save-avatar').addEventListener('click', () => {
  alert('Avatar saved! (Implement save logic here)');
});

document.querySelector('.clear-avatar').addEventListener('click', () => {
  // Clear all preview layers except the base
  document.querySelectorAll('.avatar-img-preview:not(.base)').forEach(preview => {
    preview.src = '';
    preview.style.display = 'none';
  });

  // Remove all active item selections
  document.querySelectorAll('.item.active').forEach(item => {
    item.classList.remove('active');
  });
});


// Fixed transform data for each category (manually defined)
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const src = img.getAttribute('src');
    const category = item.closest('.tab-content').id;

    const previewImg = document.querySelector(`.avatar-img-preview.${category}`);
    const isActive = item.classList.contains('active');

    // Deselect if already active
    if (isActive) {
      item.classList.remove('active');
      previewImg.src = '';
      previewImg.style.display = 'none';
    } else {
      // Remove active from others in the same category
      item.closest('.item-grid').querySelectorAll('.item').forEach(i => i.classList.remove('active'));

      // Select the clicked one
      item.classList.add('active');
      previewImg.src = src;
      previewImg.style.display = 'block';
    }
  });
});

