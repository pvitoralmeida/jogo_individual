class DefeatScreen extends Phaser.Scene {
  // Construtor da cena
  constructor() {
    super({
      key: "DefeatScreen",
    });
  }

  // Inicialização das variáveis
  init() {
    // Cutscene
    this.cutscene;

    // Background
    this.bg;

    // Teclado
    this.teclado3;
  }

  preload() {
    // Carrega a cutscene
    this.load.spritesheet("cutscene2", "assets/cut2.png", {
      frameWidth: 723.25,
      frameHeight: 491.5,
    });

    // Carrega o background
    this.load.spritesheet("bg", "assets/cut1.png", {
      frameWidth: 650,
      frameHeight: 480,
    });
  }

  create() {
    // Permite acessar as teclas
    this.teclado3 = this.input.keyboard.createCursorKeys();

    // Adiciona o background
    this.bg = this.add.sprite(650, 410, "bg").setScale(2);

    // Adiciona a imagem das cutscene
    this.cutscene = this.add.sprite(650, 410, "cutscene2").setScale(1.8);

    // Anima o background
    this.anims.create({
      key: "bgAnim",
      frames: this.bg.anims.generateFrameNumbers("bg", { start: 0, end: 2 }),
      frameRate: 7,
      repeat: -1,
    });
    this.bg.anims.play("bgAnim", true);

    // Adiciona a animação de fim do minigame quando o player perder
    this.anims.create({
      key: "cutAnim2",
      frames: this.anims.generateFrameNumbers("cutscene2", {
        start: 0,
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });

    // Inicia a animação de derrota
    this.cutscene.anims.play("cutAnim2", true);

    // Adicona os elementos textuais informativos
    setTimeout(() => {
      this.add.text(400, 360, "VOCÊ PERDEU", {
        fontSize: "64px",
        fill: "#fff",
        fontStyle: "bold",
        fontFamily: "Palatino Linotype",
        stroke: "#000000",
        strokeThickness: 4,
      });
      this.add.text(275, 450, 'Pressione a tecla "Space" para recomeçar', {
        fontSize: "32px",
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      });
    }, 1500);
  }

  update() {
    // Reinicia o jogo ao apertar da tecla "espaço"
    if (this.teclado3.space.isDown) {
      this.scene.stop("CharacterSelector");
      this.scene.start("CharacterSelector");
      this.scene.stop("DefeatScreen");
    }
  }
}
