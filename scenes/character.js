class CharacterSelector extends Phaser.Scene {
  // Construtor da cena
  constructor() {
    super({
      key: "CharacterSelector",
    });
  }

  // Inicialização das variáveis
  init() {
    // Jogador
    this.player = {
      character: ["aubrey", "basil"],
    };

    // Background
    this.bg;

    // Contorno
    this.aubreyOutline;
  }

  preload() {
    // Carrega o background
    this.load.spritesheet("bg", "assets/cut1.png", {
      frameWidth: 650,
      frameHeight: 480,
    });

    // Carrega o contorno
    this.load.image("aubreyOutline", "assets/aubreyContorno.png");

    // Carrega as imagens dos personagens jogáveis
    this.load.spritesheet("Aubrey", "assets/aubrey.png", {
      frameWidth: 117,
      frameHeight: 89,
    });

    this.load.spritesheet("Basil", "assets/basil.png", {
      frameWidth: 117,
      frameHeight: 89,
    });
  }

  create() {
    // Adiciona o background
    this.bg = this.add.sprite(650, 410, "bg").setScale(2);

    // Adicona os elementos textuais informativos
    this.add.text(375, 200, "PLAYER SELECT", {
      fontSize: "64px",
      fill: "#fff",
      fontStyle: "bold",
      fontFamily: "Palatino Linotype",
    });
    this.add.text(445, 500, "Aubrey", { fontSize: "32px", fill: "#D60270" });
    this.add.text(700, 500, "Basil", { fontSize: "32px", fill: "#EBFF69" });

    // Adiciona os contornos
    this.aubreyOutline = this.add.image(505, 415, "aubreyOutline").setScale(1.55);

    // Adiciona os ícones das opções de personagem
    this.player.character[0] = this.add.sprite(505, 410, "Aubrey").setScale(1.5).setInteractive();
    this.player.character[1] = this.add.sprite(750, 410, "Basil").setScale(1.5).setInteractive();

    // Anima o background
    this.anims.create({
      key: "bgAnim",
      frames: this.bg.anims.generateFrameNumbers("bg", { start: 0, end: 2 }),
      frameRate: 7,
      repeat: -1,
    });
    this.bg.anims.play("bgAnim", true);

    // Chama a função para animar os ícones de personagem
    HeadAnimation(this, "aubreyHead", "Aubrey");
    HeadAnimation(this, "basilHead", "Basil");

    // Configura a seleção do personagem ao clique
    this.player.character[0].on("pointerdown", () => {
      this.game.registry.set("selectedCharacter", "aubrey"); // Salva o personagem escolhido para o game
      this.game.registry.set("characterMini", "aubreyMini"); // Salva o personagem escolhido para o minigame
      // Reinicia a memória cena do jogo e inicia ela, bem como para a cena atual
      this.scene.stop("Game");
      this.scene.start("Game");
      this.scene.stop("CharacterSelector");
    });

    this.player.character[1].on("pointerdown", () => {
      this.game.registry.set("selectedCharacter", "basil"); // Salva o personagem escolhido para o game
      this.game.registry.set("characterMini", "basilMini"); // Salva o personagem escolhido para o minigame
      // Reinicia a memória cena do jogo e inicia ela, bem como para a cena atual
      this.scene.stop("Game");
      this.scene.start("Game");
      this.scene.stop("CharacterSelector");
    });

    // Inicia a animação dos personagens na tela de seleção quando o ponteiro do mouse passa por cima do ícone
    this.player.character[0].on("pointerover", () => {
      this.player.character[0].anims.play("aubreyHead", true);
      this.player.character[0].setScale(1.75);
      this.aubreyOutline.setScale(1.8);
    });
    this.player.character[1].on("pointerover", () => {
      this.player.character[1].anims.play("basilHead", true);
      this.player.character[1].setScale(1.75);
    });

    // Para a animação quando o mouse sair e retorna ao primeiro frame
    this.player.character[0].on("pointerout", () => {
      this.player.character[0].anims.stop();
      this.player.character[0].setFrame(0);
      this.player.character[0].setScale(1.5);
      this.aubreyOutline.setScale(1.55);
    });
    this.player.character[1].on("pointerout", () => {
      this.player.character[1].anims.stop();
      this.player.character[1].setFrame(0);
      this.player.character[1].setScale(1.5);
    });
  }
}

// Função para criar animações de personagens
function HeadAnimation(scene, key, character) {
  scene.anims.create({
    key: key,
    frames: scene.anims.generateFrameNumbers(character, { start: 0, end: 2 }),
    frameRate: 6,
    repeat: -1,
  });
}
