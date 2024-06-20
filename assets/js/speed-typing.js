// Константы
const quoteApiUrl = 'https://api.quotable.io/random?minLength=80&maxLength=100';

const quoteSection = document.querySelector('#quote'),
   userInput = document.querySelector('#quote-input'),
   startTestButton = document.querySelector('#start-test'),
   stopTestButton = document.querySelector('#stop-test'),
   typingMistakesDisplay = document.querySelector('#typing-mistakes'),
   typingTimerDisplay = document.querySelector('#typing-timer'),
   accuracyDisplay = document.querySelector('#accuracy'),
   wpmDisplay = document.querySelector('#wpm'),
   backLinkButton = document.querySelector('#back-link');

let quote = '',
   time = 60,
   timer,
   mistakes = 0;

const renderNewQuote = async () => {
   try {
      const response = await fetch(quoteApiUrl);
      const data = await response.json();
      quote = data.content;

      const charArray = quote.split('').map((char) => `<span class="quote-char">${char}</span>`);
      quoteSection.innerHTML = charArray.join('');
   } catch (error) {
      console.error('Failed to fetch new quote:', error);
   }
};

const updateTimer = () => {
   if (time === 0) {
      displayResult();
   } else {
      typingTimerDisplay.innerText = `${--time}s`;
   }
};

const timeReduce = () => {
   time = 60;
   timer = setInterval(updateTimer, 1000);
};

const displayResult = () => {
   clearInterval(timer);
   stopTestButton.style.display = 'none';
   userInput.disabled = true;

   const timeTaken = (60 - time) / 100 || 1;
   const speed = (userInput.value.length / 5 / timeTaken).toFixed(2);
   const accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);

   wpmDisplay.innerText = `${speed} wpm`;
   accuracyDisplay.innerText = `${accuracy}%`;

   document.querySelector('.typing-result').style.display = 'block';
};

const startTest = () => {
   mistakes = 0;
   userInput.disabled = false;
   timeReduce();

   startTestButton.style.display = 'none';
   stopTestButton.style.display = 'block';
   userInput.focus();
};

userInput.addEventListener('input', () => {
   const quoteChars = document.querySelectorAll('.quote-char');
   let userInputChars = userInput.value.split('');

   quoteChars.forEach((char, i) => {
      if (char.textContent === userInput.value[i]) {
         char.classList.add('success');
      } else if (userInputChars[i] == null) {
         char.classList.remove('success');
         char.classList.remove('fail');
      } else {
         if (!char.classList.contains('fail')) {
            mistakes++;
            char.classList.add('fail');
         }
         typingMistakesDisplay.innerText = mistakes;
      }
   });

   const allCorrect = Array.from(quoteChars).every((elem) => elem.classList.contains('success'));
   if (allCorrect) {
      displayResult();
   }
});

backLinkButton.addEventListener('click', () => {
   const screens = document.querySelectorAll('.screen');
   screens.forEach((screen) => screen.classList.remove('visible'));
   screens[0].classList.add('visible');
});

window.onload = () => {
   userInput.value = '';
   startTestButton.style.display = 'block';
   stopTestButton.style.display = 'none';
   userInput.disabled = true;
   renderNewQuote();
};
