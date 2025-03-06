class VictoryScreen extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'VictoryScreen',
        });
    }

    // Inicialização das variáveis
    init() {

        // Cutscene
        this.cutscene;

        // Background
        this.bg;

        // Teclado
        this.teclado4;

    }

    preload() {
        // Carrega a cutscene
        this.load.spritesheet('cutscene3', 'assets/cut3.png',{
            frameWidth: 640,
            frameHeight: 480,
        });

        // Carrega o background
        this.load.spritesheet('bg', 'assets/cut1.png', {
            frameWidth: 650,
            frameHeight: 480,
        });
    }

    create() {

        // Permite acessar as teclas
        this.teclado4 = this.input.keyboard.createCursorKeys();

        // Adiciona o background
        this.bg = this.add.sprite(650, 410, 'bg').setScale(2);

        // Adiciona a imagem das cutscene
        this.cutscene = this.add.sprite(650, 410, 'cutscene3').setScale(2.2);

        // Anima o background
        this.anims.create({
            key: 'bgAnim',
            frames: this.bg.anims.generateFrameNumbers('bg', {start: 0, end: 2}),
            frameRate: 7,
            repeat: -1
        });
        this.bg.anims.play('bgAnim', true);

        // Adiciona a animação de fim do minigame quando o player ganhar
        this.anims.create({
            key: 'cutAnim3',
            frames: this.anims.generateFrameNumbers('cutscene3', {
                start: 6,
                end: 8,
            }),
            frameRate: 7,
            repeat: -1,
        });

        // Inicia a animação de vitória
        this.cutscene.anims.play('cutAnim3', true);

        // Adicona os elementos textuais informativos
        setTimeout(() => {
            this.add.text(380, 300, 'VOCÊ ESCAPOU', {
                fontSize: '64px',
                fill: '#fff',
                fontStyle: 'bold',
                fontFamily: 'Palatino Linotype',
                stroke: '#000000',
                strokeThickness: 4
                });
            this.add.text(275, 390, 'Pressione a tecla "Space" para recomeçar', { 
                fontSize: '32px', 
                fill: '#FFFFFF', 
                stroke: '#000000',
                strokeThickness: 2
                });
        }, 1500)
    }

    update() {

        // Reinicia o jogo ao apertar da tecla "espaço"
        if (this.teclado4.space.isDown) {      
            this.scene.stop('CharacterSelector');
            this.scene.start('CharacterSelector');
            this.scene.stop('DefeatScreen'); 
        }
    }
}