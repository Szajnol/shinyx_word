let progressBarTimer;
const winSound = new Audio('success.mp3');
const loseSound = new Audio('error.mp3');

$(document).ready(function() {

  window.addEventListener("message", function(event) {
    if (event.data.action === "StartMinigame") {
      startGame();
    }
  });

  function startProgressBar(duration, onComplete) {
    let progressBar = document.querySelector(".fill");
    let progress = 100;
    let interval = 10;

    progressBarTimer = setInterval(function() {
      if (progress <= 0) {
        clearInterval(progressBarTimer);
        if (typeof onComplete === "function") {
          onComplete();
        }
      } else {
        progress -= (interval / duration) * 100;
        progressBar.style.width = Math.max(progress, 0) + "%";
      }
    }, interval);
  }

  function stopProgressBar() {
    clearInterval(progressBarTimer);
  }

  function startGame() {
    $('.minigame-container').fadeIn(500)
    $('.center').text('Poczekaj na symbole');
    startProgressBar(4200, function() {
      startProgressBar(15000, function(){
        $('.center').text('ERROR');
        $.post(`http://${GetParentResourceName()}/nieudane`);
        stopProgressBar();
        startProgressBar(2000);
        setTimeout(() => {
          hideIcons();
          $('.minigame-container').fadeOut(500);
          loseSound.play()
        }, 2000);
      });
      $('.center').text('Znajdz Slowo');
    });

    const words = ["ZDRAPKA", "GRAFIKA" , "BRZUSZEK"];
    const chosenWord = words[Math.floor(Math.random() * words.length)];
    const divIds = ["1", "2", "3", "4", "5", "6", "7", "8"];

    document.getElementById('word').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        const inputValue = event.target.value;
        event.target.value = '';
        if (inputValue === chosenWord) {
          $('.center').text('SUCCESS');
          $.post(`http://${GetParentResourceName()}/udane`);
          stopProgressBar();
          startProgressBar(2000);
          setTimeout(() => {
            hideIcons();
            $('.minigame-container').fadeOut(500);
            winSound.play()
          }, 2000);
  
        }else if (inputValue !== chosenWord){
        $('.center').text('ERROR');
        $.post(`http://${GetParentResourceName()}/nieudane`);
        stopProgressBar();
        startProgressBar(2000);
        setTimeout(() => {
          hideIcons();
          $('.minigame-container').fadeOut(500);
          loseSound.play()
        }, 2000);

        }
       
      }
    });

    function getRandomElement(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr.splice(randomIndex, 1)[0];
    }

    for (let i = 0; i < chosenWord.length; i++) {
      const letter = chosenWord[i];
      const divId = getRandomElement(divIds);
      const div = document.getElementById(divId);
      if (div) {
        div.textContent = letter;
        if (i === 0) {
          // Zmiana tła pierwszej litery
          div.style.fill = "#FF8ED9";
        }else if (i === 1) {
          // Zmiana tła pierwszej litery
          div.style.fill = "#7F496D";
        }
      }
    }

    arrangeIcons();
  }

  function arrangeIcons() {
    let elems = $('div.icon').not('#icon-0');
    let increase = Math.PI * 2 / elems.length;
    let angle = 0;
    let radius = 250;

    let center_top = ($("#slider-1").height() - $("#icon-0").height()) / 1.1;
    let center_left = ($("#slider-1").width() - $("#icon-0").width()) / 2;

    $('.icon').css({
      'top': center_top + 'px',
      'left': center_left + 'px'
    });

    $(elems).css('opacity', '0').each(function(i) {
      let x = radius * Math.cos(angle) + center_left;
      let y = radius * Math.sin(angle) + center_top;
      
      $(this).delay(500 * i).animate({
        'position': 'absolute',
        'left': x + 'px',
        'top': y + 'px',
        'opacity': '1'
      }, 1000);
      
      angle += increase;
    });

    $("#icon-0").css({
      'left': "50%",
      'top': "50%"
    });
  }

  function hideIcons() {
    for (let i = 1; i <= 8; i++) {
      $(`#icon-${i}`).css('opacity', '0');
    }
  }
});
