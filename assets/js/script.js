document.addEventListener('DOMContentLoaded', () => {
   const easyModeBtn = document.querySelector('#easy-mode'),
      hardModeBtn = document.querySelector('#hard-mode'),
      screens = document.querySelectorAll('.screen');
   // backBtn = document.querySelector('.back');

   easyModeBtn.addEventListener('click', () => {
      toggleScreen(screens[0], screens[1]);
      startGame(false); // false means no time limit
   });

   hardModeBtn.addEventListener('click', () => {
      toggleScreen(screens[0], screens[1]);
      startGame(true); // true means time limit
   });

   // backBtn.addEventListener('click', () => {
   //    toggleScreen(screens[1], screens[0]);
   // });

   const keys = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

   const getRandomNumber = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
   };

   const getRandomKey = () => {
      return keys[getRandomNumber(0, keys.length - 1)];
   };

   const targetRandomKey = () => {
      const randomKey = getRandomKey();
      const key = document.getElementById(randomKey);
      const keyElements = document.querySelectorAll('.keyboard ul li');

      keyElements.forEach((keyElement) => {
         keyElement.classList.remove('selected', 'hit');
      });

      if (key) {
         key.classList.add('selected');
      } else {
         console.error(`Key element with id ${randomKey} not found`);
         targetRandomKey();
      }
   };

   let score = 0;
   let bestScore = localStorage.getItem('bestScore') || 0;
   const resultElement = document.querySelector('.result');
   const bestScoreElement = document.querySelector('.best');
   const timerElement = document.querySelector('.timer');

   bestScoreElement.innerHTML = `Ваш рекорд: ${bestScore}`;

   const playKeySound = () => {
      const audio = document.querySelector('#keypress');
      audio.play();
   };

   const handleKeyUp = (event) => {
      const keyPressed = event.key.toUpperCase();

      if (!keys.includes(keyPressed)) return;

      const keyElement = document.getElementById(keyPressed);
      const highlightKey = document.querySelector('.selected');

      if (!keyElement) {
         console.error(`Key element with id ${keyPressed} not found`);
         return;
      }

      playKeySound();
      keyElement.classList.add('hit');

      const handleAnimationEnd = () => {
         keyElement.classList.remove('hit');

         if (highlightKey && keyPressed === highlightKey.id) {
            score += 1;
         } else {
            alert('Вы проиграли. Нажимайте внимательнее.');
            score = 0;
            toggleScreen(screens[1], screens[0]);
         }

         resultElement.innerHTML = `Очки: ${score}`;

         if (score > bestScore) {
            bestScore = score;
            bestScoreElement.innerHTML = `Ваш рекорд: ${bestScore}`;
            localStorage.setItem('bestScore', bestScore);
         }

         if (highlightKey) {
            highlightKey.classList.remove('selected');
         }
         targetRandomKey();

         keyElement.removeEventListener('animationend', handleAnimationEnd);
      };

      keyElement.addEventListener('animationend', handleAnimationEnd);
   };

   const startGame = (isTimed) => {
      score = 0;
      resultElement.innerHTML = `Очки: ${score}`;
      document.removeEventListener('keyup', handleKeyUp);
      document.addEventListener('keyup', handleKeyUp);
      targetRandomKey();

      if (isTimed) {
         timerElement.style.display = 'block';
         startTimer();
      } else {
         timerElement.style.display = 'none';
      }
   };

   const startTimer = () => {
      let timeLeft = 60;
      timerElement.innerHTML = `Время: ${timeLeft}s`;

      const countdown = setInterval(() => {
         timeLeft -= 1;
         timerElement.innerHTML = `Время: ${timeLeft}s`;

         if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
         }
      }, 1000);
   };

   const endGame = () => {
      alert(`Время истекло! Ваш счёт: ${score}`);
      toggleScreen(screens[1], screens[0]);
   };

   function toggleScreen(screenToHide, screenToShow) {
      screenToHide.classList.remove('visible');
      screenToShow.classList.add('visible');
   }
});
