document.addEventListener('DOMContentLoaded', () => {
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

   const playKeySound = () => {
      const audio = document.querySelector('#keypress');
      audio.play();
   };

   document.addEventListener('keyup', (event) => {
      const keyPressed = event.key.toUpperCase();

      if (!keys.includes(keyPressed)) return;

      const keyElement = document.getElementById(keyPressed);
      const highlightKey = document.querySelector('.selected');
      const result = document.querySelector('.result');

      if (!keyElement) {
         console.error(`Key element with id ${keyPressed} not found`);
         return;
      }

      playKeySound(); // Play the sound here
      keyElement.classList.add('hit');

      const handleAnimationEnd = () => {
         keyElement.classList.remove('hit');

         if (highlightKey && keyPressed === highlightKey.id) {
            score += 1;
         } else {
            alert('Вы проиграли. Нажимайте внимательнее.');
            score = 0;
         }

         result.innerHTML = `Очки ${score}`;
         if (highlightKey) {
            highlightKey.classList.remove('selected');
         }
         targetRandomKey();

         keyElement.removeEventListener('animationend', handleAnimationEnd);
      };

      keyElement.addEventListener('animationend', handleAnimationEnd);
   });

   targetRandomKey();
});
