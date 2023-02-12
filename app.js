const snake = document.querySelector("#snake");
const arena = document.querySelector("#arena");

let cadence, score, direction, interval, posX, posY;

// On initialise le jeu
init();

function init() {
  score = 0;
  direction = null;
  cadence = 100;

  document.querySelector("h3 span").innerHTML = score;

  // On place le snake au centre de l'arène, aligné sur le grille.
  posX =
    Math.floor(arena.offsetWidth / 2 / snake.offsetWidth) *
    snake.offsetWidth;
  posY =
    Math.floor(arena.offsetHeight / 2 / snake.offsetHeight) *
    snake.offsetHeight;

  snake.style.left = posX + "px";
  snake.style.top = posY + "px";

  // On crée le premier pixel ...
  createPixel("food");

  // ... et on lance la partie
  play();
}

function play() {
  // Ma boucle de jeu
  interval = setInterval(() => {
    if (direction == "up") {
      posY -= snake.offsetHeight;
      if (posY < 0) {
        posY = arena.offsetHeight - snake.offsetHeight;
      }
    }
    if (direction == "down") {
      posY += snake.offsetHeight;
      if (posY >= arena.offsetHeight) {
        posY = 0;
      }
    }
    if (direction == "left") {
      posX -= snake.offsetWidth;
      if (posX < 0) {
        posX = arena.offsetWidth - snake.offsetWidth;
      }
    }
    if (direction == "right") {
      posX += snake.offsetWidth;
      if (posX >= arena.offsetWidth) {
        posX = 0;
      }
    }

    snake.style.top = posY + "px";
    snake.style.left = posX + "px";

    // On vérifie si la position du snake correspond à la position de chacun des pixels
    document.querySelectorAll(".pixel").forEach((pixel) => {
      if (
        snake.offsetTop == pixel.offsetTop &&
        snake.offsetLeft == pixel.offsetLeft
      ) {
        pixel.remove();

        // Si mon pixel contient la classe "pixel", je créé 5 nouveaux pixels. Sinon 1, si c'etait le dernier des pixels
        if (pixel.classList.contains("super")) {
          for (let i = 0; i < 5; i += 1) {
            createPixel("food");
          }
        } else if (document.querySelectorAll(".pixel").length == 0) {
          createPixel("food");
        }

        createPixel("wall");

        // On augmente mon score et on l'affiche
        score += 1;
        document.querySelector("h3 span").innerHTML = score;
        // On augmente la cadence ( et réduisant la valeur de la variable )
        cadence /= 1.05;
        // On arrete la boucle actuelle pour appliquer le nouveau rythme
        clearInterval(interval);
        // et on relance la fonction "play"
        play();
      }
    });

    document.querySelectorAll(".wall").forEach((wall) => {
      if (
        snake.offsetTop == wall.offsetTop &&
        snake.offsetLeft == wall.offsetLeft
      ) {
        lose();
      }
    });
  }, cadence);
}

function lose() {
  clearInterval(interval);
  alert("Votre score est de " + score);
  document.querySelectorAll(".pixel").forEach((pixel) => {
    pixel.remove();
  });
  document.querySelectorAll(".wall").forEach((pixel) => {
    pixel.remove();
  });

  init();
}

function createPixel(type) {
  const pixel = document.createElement("div");
  if (type == "food") {
    pixel.classList.add("pixel");

    // Une chance sur 10 que le pixel crée soit un "super" pixel
    if (Math.floor(Math.random() * 10) == 0) {
      pixel.classList.add("super");
    }
  } else if (type == "wall") {
    pixel.classList.add("wall");
  }

  // On prend une valeur aléatoire comprise entre 0 et 680 inclus (la largeur de l'arène - la largeur du snake, + 1 pour inclure la valeur 680 au random)
  const arenaWidthRandom =
    Math.random() * (arena.offsetWidth - snake.offsetWidth + 1);
  const arenaHeightRandom =
    Math.random() * (arena.offsetHeight - snake.offsetHeight + 1);

  // On arrondit au multiple de 20 le plus proche pour l'aligner sur la grille du snake (multiple de la largeur du snake)
  const posRandomX =
    Math.floor(arenaWidthRandom / snake.offsetWidth) *
    snake.offsetWidth;
  const posRandomY =
    Math.floor(arenaHeightRandom / snake.offsetHeight) *
    snake.offsetHeight;

  pixel.style.left = posRandomX + "px";
  pixel.style.top = posRandomY + "px";

  arena.append(pixel);
}

// On écoute les appuis sur les touches pour changer la direction du snake
document.addEventListener("keydown", (e) => {
  if (
    (e.code == "ArrowUp" || e.code == "KeyZ") &&
    direction != "down"
  ) {
    direction = "up";
  }
  if (
    (e.code == "ArrowDown" || e.code == "KeyS") &&
    direction != "up"
  ) {
    direction = "down";
  }
  if (
    (e.code == "ArrowLeft" || e.code == "KeyQ") &&
    direction != "right"
  ) {
    direction = "left";
  }
  if (
    (e.code == "ArrowRight" || e.code == "KeyD") &&
    direction != "left"
  ) {
    direction = "right";
  }
});