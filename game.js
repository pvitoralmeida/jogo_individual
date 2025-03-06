class Game extends Phaser.Scene {
  // Construtor da cena
  constructor() {
    super({ key: "Game" });
  }

  // Inicialização das variáveis
  init() {
    // Jogador
    this.player = {
      character: null,
      obj: null,
      scale: null,
      spriteStart: null,
      spriteEnd: null,
      spriteDefault: null,
      x: null,
    };

    // Inimigo
    this.enemy = {
      delay1: [750, 1000, 1500],
      delay2: [4000, 7000, 9000],
      eyesOpen: false,
      init: false,
      obj: null,
    };

    // Mapa
    this.map = {
      x_start: 1575,
      x: 1575,
      y: 410,
      obj: null,
    };

    // Aviso
    this.warning = {
      instruction: [],
      stage: ["Não deixe ele te ver...", "O desespero te consome...", "Reze pela sua vida..."],
      obj: null,
    };

    // Iniciador
    this.initiator = false;

    // Teclado
    this.teclado;

    // Define as posições atualizadas (depois do minigame) ou padrões (1º vez)
    this.map.x = this.game.registry.get("mapPosition") || 1575;
    this.player.x = this.game.registry.get("playerPosition") || 150;

    // Define o personagem com base na escolha do usuário
    this.player.character = this.game.registry.get("selectedCharacter");

    // Define a escala do sprite com base no personagem escolhido
    if (this.player.character === "aubrey") {
      this.player.scale = 2;
      this.player.spriteStart = 6;
      this.player.spriteEnd = 8;
      this.player.spriteDefault = 7;
    } else if (this.player.character === "basil") {
      this.player.scale = 4;
      this.player.spriteStart = 0;
      this.player.spriteEnd = 3;
      this.player.spriteDefault = 1;
    }

    // Reinicia algumas variáveis importantes sempre que a cena é chamada
    this.enemy.init = false;
    this.enemy.eyesOpen = false;
  }

  preload() {
    // Carrega os sprites dos personagens
    this.load.spritesheet("aubrey", "assets/aubrey2.png", {
      frameWidth: 61.3,
      frameHeight: 70,
    });
    this.load.spritesheet("basil", "assets/basil2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Carrega o mapa
    this.load.image("map", "assets/mapa.png");

    // Carrega o inimigo
    this.load.spritesheet("enemy", "assets/monk.png", {
      frameWidth: 78.4,
      frameHeight: 80,
    });
  }

  create() {
    // Adiciona o background
    this.map.obj = this.add.image(this.map.x_start, 410, "map");

    // Se já existir um registro do player, apaga antes de definir de novo
    if (this.player.obj) {
      this.player.obj.destroy();
    }

    // Adiciona o player com o sprite do personagem escolhido e a escala adequada
    this.player.obj = this.add.sprite(this.player.x, 600, this.player.character).setScale(this.player.scale);
    this.player.obj.setFrame(this.player.spriteDefault);

    // Adicona textos com instruções sobre o funcionamento do jogo
    this.warning.instruction[0] = this.add.text(100, 670, "Presione a tecla direcional DIREITA para começar/continuar", {
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 8,
    });
    this.warning.instruction[1] = this.add.text(375, 115, '"Ele" é seu INIMIGO,  NÃO se\nmova enquanto ele estiver de -->\nolhos ABERTOS.', {
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 8,
    });
    this.warning.instruction[2] = this.add.text(375, 260, "Use a tecla direcional DIREITA para se\nmover e escapar desse PESADELO.", {
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 8,
    });

    // Cria o aviso inicial sobre o inimigo
    this.warning.obj = this.add.text(100, 100, this.warning.stage[0], { fontSize: "32px", fill: "#FFFFFF" });
    this.warning.obj.setVisible(false);

    // Adiciona o inimigo
    this.enemy.obj = this.add.sprite(1100, 150, "enemy").setScale(2);

    // Permite acessar as teclas
    this.teclado = this.input.keyboard.createCursorKeys();

    // Exclui a animação do player caso ela já tenha sido criada anteriormente
    if (this.animation) {
      this.animation.destroy();
    }

    // Anima o movimento do player
    this.animation = this.anims.create({
      key: "goAhead",
      frames: this.player.obj.anims.generateFrameNumbers(this.player.character, {
        start: this.player.spriteStart,
        end: this.player.spriteEnd,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  update() {
    // Atualiza a posição da imagem de fundo
    this.map.obj.x = this.map.x;

    if (this.teclado.right.isDown) {
      // Permite o início do do jogo ao apertar da tecla direcional direita
      this.initiator = true;

      // Destrói todas as mensagens de alerta
      for (let i = 0; i < this.warning.instruction.length; i++) {
        this.warning.instruction[i].destroy();
      }

      // Deixa visível os avisos sobre o inimigo durante o jogo
      this.warning.obj.setVisible(true);
    }

    // Inicia o jogo caso a tecla indicada for apertada
    if (this.initiator === true) {
      // Move o mapa e ativa a animação para dar sensação de movimento
      if (this.teclado.right.isDown) {
        if (this.map.x >= -290) {
          this.map.x -= 3;
        } else {
          this.player.obj.setX(this.player.obj.x + 3);
        }
        this.player.obj.anims.play("goAhead", true);
      } else {
        this.player.obj.anims.stop();
      }

      // Chama as funções que definem o comportamento do inimigo
      if (this.map.x < 1500) {
        this.redLight();
      }

      // Manda o player para um minigame quando ele comete um erro no jogo principal
      if (this.enemy.eyesOpen === true && this.teclado.right.isDown) {
        // Guarda as posições do player e do mapa antes de ir para o minigame
        this.game.registry.set("mapPosition", this.map.x);
        this.game.registry.set("playerPosition", this.player.obj.x);

        // Para as funções "setTimeout()" para evitar erros
        this.shutdown();

        // Inicia o minigame
        this.scene.stop("MiniGame");
        this.scene.start("MiniGame");
        this.scene.stop("Game");
      }

      if (this.player.obj.x > 1360) {
        // Reseta as posições do player e do mapa antes de ir para a tela de vitória
        this.game.registry.set("mapPosition", 1575);
        this.game.registry.set("playerPosition", 150);

        // Para as funções "setTimeout()" para evitar erros
        this.shutdown();

        // Inicia o minigame
        this.scene.stop("VictoryScreen");
        this.scene.start("VictoryScreen");
        this.scene.stop("Game");
      }
    }
  }

  // Função que define o comportamento do inimigo
  redLight() {
    // Verifica se a função já está em execução e so executa todo código caso ela não esteja
    if (this.enemy.init) return;
    // Indica que a função está em execução
    this.enemy.init = true;

    // Atraso para manter o frame 2
    let firstDelay = Phaser.Math.RND.pick(this.enemy.delay1);
    // Muda o frame do inimigo para o frame 2
    this.enemy.obj.setFrame(2);
    // Atualiza o texto de acordo com o frame do inimigo
    this.warning.obj.setText(this.warning.stage[1]);

    // Após o tempo de atraso definido, muda o frame do inimigo para o frame 1
    this.enemy.timer1 = setTimeout(() => {
      this.enemy.obj.setFrame(1);
      // Atualiza o texto de acordo com o frame do inimigo
      this.warning.obj.setText(this.warning.stage[2]);
      // Indica que o inimigo está "observando" o player, ou seja, que se ele se mover irá perder
      this.enemy.eyesOpen = true;
    }, firstDelay);

    // Atraso para manter o frame 1
    let secondDelay = Phaser.Math.RND.pick(this.enemy.delay2);

    // Após o tempo de atraso definido, muda o frame do inimigo para o frame 0
    this.enemy.timer2 = setTimeout(() => {
      this.enemy.obj.setFrame(0);
      // Atualiza o texto de acordo com o frame do inimigo
      this.warning.obj.setText(this.warning.stage[0]);
      // Desativa o modo "observador"
      this.enemy.eyesOpen = false;

      // Atraso para manter o frame 0
      let thirdDelay = Phaser.Math.RND.pick(this.enemy.delay2);

      // Após o tempo de atraso definido, deixa a função pronta para ser iniciada novamente
      this.enemy.timer3 = setTimeout(() => {
        this.enemy.init = false;
      }, thirdDelay);
    }, secondDelay);
  }

  // Função que para os timeouts em execução
  shutdown() {
    clearTimeout(this.enemy.timer1);
    clearTimeout(this.enemy.timer2);
    clearTimeout(this.enemy.timer3);
  }
}
