class MiniGame extends Phaser.Scene {
  // construtor da cena
  constructor() {
    super({ key: "MiniGame" });
  }

  // Inicialização das variáveis
  init() {
    // Jogador
    this.player = {
      character: null,
      obj: null,
    };

    // Projéteis
    this.projectile = {
      movement: null,
      pro1: null,
      pro2: null,
      speed1: 0.02,
      speed2: 0,
      angle: 0,
      damage: 0,
      obj: null,
    };

    // Background
    this.bg;

    // Obstáculo
    this.obstacle;

    // Coelho
    this.bunny = {
      x: null,
      y: null,
      obj: null,
      catchable: true,
      score: 0,
      scoreboard: null,
    };

    // Retrato
    this.portrait = {
      obj: null,
      character: null,
      frameIndex: 0,
      animIndex: 0,
    };

    // Cutscenes
    this.cutscene = {
      cut1: null,
      cut2: null,
      obj: null,
    };

    // Texto
    this.message = [];

    // Iniciador
    this.initiator = false;

    // Define o personagem com base na escolha do usuário
    this.player.character = this.game.registry.get("characterMini");

    // Teclado
    this.teclado2;
  }

  preload() {
    // Carrega o background do minigame
    this.load.image("miniBg", "assets/mini1.png");

    // Carrega as spritesheets dos personagens
    this.load.spritesheet("aubreyMini", "assets/aubrey.png", {
      frameWidth: 117,
      frameHeight: 89,
    });
    this.load.spritesheet("basilMini", "assets/basil.png", {
      frameWidth: 117,
      frameHeight: 89,
    });

    // Carrega a spritesheet dos projéteis
    this.load.spritesheet("projectile", "assets/Spirit.png", {
      frameWidth: 50,
      frameHeight: 75,
    });

    // Carrega a imagem de outros elementos do minigame
    this.load.image("obstacle", "assets/obstaculo.png");
    this.load.image("bunny", "assets/bunny.png");
    this.load.image("portrait", "assets/moldura.png");

    // Carrega as imagens para as cutscenes
    this.load.spritesheet("cutscene1", "assets/cut1.png", {
      frameWidth: 650,
      frameHeight: 480,
    });
  }

  create() {
    // Adiciona o background
    this.add.image(650, 410, "miniBg").setScale(2);

    // Adicona texto explicativo
    this.message[0] = this.add.text(300, 650, 'Presione a tecla "SPACE" para iniciar', {
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 8,
    });
    this.message[1] = this.add.text(275, 100, "    Esse é seu estado emocional,\n<-- EVITE os espíritos malignos\n    para mantê-lo estável.", {
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 8,
    });
    this.message[2] = this.add.text(350, 360, "Use as teclas direcionais para\nse mover e CAPTURAR os COELHOS.\nDICA: eles são sua SALVAÇÃO.", {
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 8,
    });

    // Ativa o teclado
    this.teclado2 = this.input.keyboard.createCursorKeys();

    // Adiciona outros elementos
    this.obstacle = this.physics.add.staticImage(650, 410, "obstacle").setScale(0.9);
    this.obstacle.setVisible(false);
    this.portrait.obj = this.physics.add.staticImage(125, 125, "portrait").setScale(2);
    this.portrait.obj.body.setSize(200, 200, true);
    this.portrait.obj.body.setOffset(-42, -20);
    this.portrait.character = this.add.sprite(130, 140, this.player.character).setScale(1.5);
    this.add.text(45, 25, "Estado Emocional", {
      fontSize: "16px",
      fill: "#FFFFFF",
    });

    // Adiciona o primeiro coelho
    this.bunny.x = Phaser.Math.RND.pick([Phaser.Math.Between(300, 500), Phaser.Math.Between(800, 1100)]);
    this.bunny.y = Phaser.Math.RND.pick([Phaser.Math.Between(110, 310), Phaser.Math.Between(510, 710)]);
    this.bunny.obj = this.physics.add.staticImage(this.bunny.x, this.bunny.y, "bunny").setScale(0.5);
    this.bunny.obj.setVisible(false);
    this.bunny.obj.body.setSize(65, 70, true);
    this.bunny.obj.body.setOffset(30, 40);

    // Adiciona o placar de coelhos capturados
    this.bunny.scoreboard = this.add.text(800, 50, "Coelhos Capturados: " + this.bunny.score + "/10", {
      fontSize: "32px",
      fill: "#FFFFFF",
    });

    // Adiciona os projéteis
    this.projectile.pro1 = this.physics.add.sprite(650, 410, "projectile").setScale(1.3);
    this.projectile.pro1.body.setSize(20, 20, true);
    this.projectile.pro1.setFrame(0);
    this.projectile.pro1.setVisible(false);

    this.projectile.pro2 = this.physics.add.sprite(1100, 410, "projectile").setScale(1.3);
    this.projectile.pro2.body.setSize(20, 20, true);
    this.projectile.pro2.setFrame(6);
    this.projectile.pro2.setVisible(false);

    // Adiciona o player
    this.player.obj = this.physics.add.sprite(100, 410, this.player.character);
    this.player.obj.setFrame(3);
    this.player.obj.body.setSize(70, 80, true);
    this.player.obj.setCollideWorldBounds(true);

    // Adiciona as imagens das cutscenes
    this.cutscene.cut1 = this.add.sprite(650, 410, "cutscene1").setScale(2);

    // Adiciona as colisões
    this.physics.add.collider(this.player.obj, this.obstacle);
    this.physics.add.collider(this.player.obj, this.portrait.obj);

    // Adicona as animações dos projéteis
    this.anims.create({
      key: "pro1Move",
      frames: this.anims.generateFrameNumbers("projectile", {
        start: 0,
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });
    this.projectile.pro1.anims.play("pro1Move", true);

    this.anims.create({
      key: "pro2Move",
      frames: this.anims.generateFrameNumbers("projectile", {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.projectile.pro2.anims.play("pro2Move", true);

    // Adiciona e inicia a animação inicial do personagem no retrato
    this.portraitAnim(this.portrait.frameIndex);

    // Adiciona a animação da cutscene de início do minigame
    this.anims.create({
      key: "cutAnim1",
      frames: this.anims.generateFrameNumbers("cutscene1", {
        start: 16,
        end: 19,
      }),
      frameRate: 2,
      repeat: 0,
    });
    this.cutscene.cut1.anims.play("cutAnim1", true);
    setTimeout(() => {
      this.cutscene.cut1.setVisible(false);
    }, 3000);

    // Configura a colisão do player com os projéteis
    this.physics.add.overlap(this.player.obj, this.projectile.pro1, () => {
      this.player.obj.setFrame(6); // Muda o frame do player
      this.portrait.character.stop(); // Para a animação atual
      this.projectile.damage += 1; // Aumenta em um o dano causado pelos projéteis

      // Atualiza os frames de início e fim
      if (this.projectile.damage < 5) {
        this.portrait.frameIndex += 3;
      }

      // Desativa a colisão do projétil
      this.projectile.pro1.body.setEnable(false);

      // Cria uma nova animação com os novos frames
      this.portraitAnim(this.portrait.frameIndex);

      this.projectile.timer1 = setTimeout(() => {
        this.player.obj.setFrame(5); // Volta para o frame original do player depois de 1 segundo
        this.projectile.pro1.body.setEnable(true); // Reativa a colisão do projétil
      }, 1000);
    });

    this.physics.add.overlap(this.player.obj, this.projectile.pro2, () => {
      this.player.obj.setFrame(12); // Muda o frame do player
      this.portrait.character.stop(); // Para a animação atual
      this.projectile.damage += 1; // Aumenta em um o dano causado pelos projéteis

      // Atualiza os frames de início e fim da animação do retrato
      if (this.projectile.damage < 5) {
        this.portrait.frameIndex += 3;
      }
      // Desativa a colisão do projétil
      this.projectile.pro2.body.setEnable(false);

      // Cria uma nova animação com os novos frames
      this.portraitAnim(this.portrait.frameIndex);

      this.projectile.timer2 = setTimeout(() => {
        this.player.obj.setFrame(5); // Volta para o frame original do player depois de 1 segundo
        this.projectile.pro2.body.setEnable(true); // Reativa a colisão do projétil
      }, 1000);
    });

    // Adiciona a interação de coletar coelhos
    this.physics.add.overlap(this.player.obj, this.bunny.obj, () => {
      this.bunny.obj.setVisible(false);
      this.bunny.score += 1;
      this.bunny.scoreboard.setText("Coelhos Capturados: " + this.bunny.score + "/10");
      this.bunny.obj.setPosition(5000, 5000);
      this.bunny.obj.body.updateFromGameObject();
      this.bunny.timer1 = setTimeout(() => {
        this.spawnBunny();
        this.bunny.obj.setVisible(true);
      }, 750);
    });
  }

  update() {
    if (this.teclado2.space.isDown) {
      // Permite o início do minigame após o usuário pressionar a tecla "espaço"
      this.initiator = true;

      // Torna os elementos do minigame visíveis
      this.projectile.pro1.setVisible(true);
      this.projectile.pro2.setVisible(true);
      this.bunny.obj.setVisible(true);
      this.obstacle.setVisible(true);

      // Destrói todas as mensagens de alerta com uma estrutura de repetição
      for (let i = 0; i < this.message.length; i++) {
        this.message[i].destroy();
      }
    }

    if (this.initiator === true) {
      // Lógica de atualização da cena
      if (this.teclado2.left.isDown) {
        // Move para esquerda [ <- ]
        this.player.obj.setVelocityX(-300);
      } else if (this.teclado2.right.isDown) {
        // Move para direita [ -> ]
        this.player.obj.setVelocityX(300);
      } else {
        // Para de mover
        this.player.obj.setVelocityX(0);
      }

      if (this.teclado2.up.isDown) {
        // Move para cima
        this.player.obj.setVelocityY(-300);
      } else if (this.teclado2.down.isDown) {
        // Move para baixo
        this.player.obj.setVelocityY(300);
      } else {
        // Para de mover
        this.player.obj.setVelocityY(0);
      }

      // Define a movimentação complexa do projétil um
      this.projectile.speed2 += 0.04;
      this.projectile.pro1.y = 410 + 300 * Math.sin(this.projectile.speed2) * Math.cos(this.projectile.speed2 / 4);
      this.projectile.pro1.x = 650 + 600 * Math.sin(this.projectile.speed2 / 4) * Math.sin(this.projectile.speed2);

      // Define a movimentação circular do projétil dois
      this.projectile.angle += this.projectile.speed1;
      this.projectile.pro2.x = 650 + Math.cos(this.projectile.angle) * 400;
      this.projectile.pro2.y = 410 + Math.sin(this.projectile.angle) * 200;

      // Leva para a tela de derrota caso o jogador perca o minigame
      if (this.projectile.damage === 5) {
        this.shutdown();
        this.scene.stop("DefeatScreen");
        this.scene.start("DefeatScreen");
        this.scene.stop("Minigame");
        this.game.registry.reset(); // Reseta todos os "registry" usados até o momento
      }

      // Leva de volta a tela principal do jogo caso o jogador vença o minigame
      if (this.bunny.score === 10) {
        this.shutdown();
        this.scene.stop("Game");
        this.scene.start("Game");
        this.scene.stop("Minigame");
      }
    }
  }

  spawnBunny() {
    // Adiciona o coelho em uma posição determinda de forma randômica
    this.bunny.x = Phaser.Math.RND.pick([Phaser.Math.Between(300, 600), Phaser.Math.Between(700, 1000)]);
    this.bunny.y = Phaser.Math.RND.pick([Phaser.Math.Between(210, 360), Phaser.Math.Between(460, 610)]);
    this.bunny.obj.setPosition(this.bunny.x, this.bunny.y);
    // Atualizada o "corpo" de colisão para a nova posição do coelho
    this.bunny.obj.body.updateFromGameObject();
  }

  // Funçao que cria novas animações para representar o estado emocional do player
  portraitAnim(frameIndex) {
    if (this.animation) {
      this.animation.destroy();
    }
    this.animation = this.anims.create({
      key: `portraitAnim${this.portrait.animIndex}`,
      frames: this.anims.generateFrameNumbers(this.player.character, {
        start: frameIndex,
        end: frameIndex + 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.portrait.character.play(`portraitAnim${this.portrait.animIndex}`, true);
    this.portrait.animIndex += 1;
  }

  // Função que para os timeouts em execução
  shutdown() {
    clearTimeout(this.projectile.timer1);
    clearTimeout(this.projectile.timer2);
    clearTimeout(this.bunny.timer1);
  }
}
