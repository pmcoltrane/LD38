class Game {

    private game: Phaser.Game
    private planet: Planet
    private cursors: Phaser.CursorKeys
    private comets: Comet[] = []
    private manna: Manna[] = []
    private deity: Phaser.Sprite

    private title: Phaser.Text
    private subTitle: Phaser.Text
    private subSubTitle: Phaser.Text
    private subSubSubTitle: Phaser.Text

    private temperatureLabel: Phaser.Text
    private temperamentLabel: Phaser.Text
    private achievementLabel: Phaser.Text

    private achievementText: Phaser.Text
    private achievementBlurb: Phaser.Text

    private t: number

    public state: GameStates = GameStates.titleScreen

    constructor(elementId: string) {
        this.game = new Phaser.Game(1024, 576, Phaser.CANVAS, elementId, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        })
        this.t = 0
    }

    private makeLabel = (x, y, text): Phaser.Text => {
        var lbl = this.game.add.text(x, y, text)
        lbl.stroke = '#000000'
        lbl.fill = '#ffffff'
        lbl.strokeThickness = 2
        lbl.fontSize = 16

        return lbl
    }

    private createUI = () => {
        this.title.destroy()
        this.subTitle.destroy()
        this.subSubTitle.destroy()
        this.subSubSubTitle.destroy()

        this.temperatureLabel = this.makeLabel(875, 500, 'TEMPERATURE')
        this.temperamentLabel = this.makeLabel(875, 10, 'TEMPERAMENT')
        this.achievementLabel = this.makeLabel(10, 500, 'PINNACLE ACHIEVEMENT')

        this.achievementText = this.makeLabel(10, 520, '- UNKNOWN -')
        this.achievementText.fontSize = 12

        this.achievementBlurb = this.makeLabel(10, 540, '- UNKNOWN -')
        this.achievementBlurb.fontSize = 12
    }

    private startGame = () => {
        this.game.add.audio('thrum').play()

        this.game.physics.startSystem(Phaser.Physics.P2JS)
        this.game.physics.p2.gravity.y = 10
        this.game.physics.p2.world.defaultContactMaterial.friction = 0.3
        this.game.physics.p2.world.setGlobalStiffness(1e5)
        this.game.physics.p2.setBoundsToWorld(false, false, false, false)

        var comet = new Comet(this.game, this.playKaboom)
        this.comets.push(comet)

        this.planet = new Planet(this.game, this.playWoot, this.playFail)

        this.createUI()
        this.updateAchievement()
        this.game.world.bringToTop(this.deity)
        this.state = GameStates.gameOn
    }

    private updateAchievement = () => {
        var ach = this.planet.getAchievement()
        this.achievementText.setText(ach.description)
        this.achievementBlurb.setText(ach.blurb)
    }

    public preload = () => {
        this.game.load.image('space', 'assets/space.png')
        this.game.load.image('clouds', 'assets/fluffy-clouds.png')
        this.game.load.image('ball', 'assets/planet-0.png')
        this.game.load.image('comet', 'assets/comet.png')
        this.game.load.image('dude', 'assets/dude.png')
        this.game.load.image('heart', 'assets/heart.png')

        this.game.load.audio('explode', 'assets/explode.wav')
        this.game.load.audio('achieve', 'assets/achieve.wav')
        this.game.load.audio('hurt', 'assets/hurt.wav')
        this.game.load.audio('coin', 'assets/coin.wav')
        this.game.load.audio('thrum', 'assets/thrum.wav')
    }
    public create = () => {

        var background = this.game.add.sprite(0, 288, 'space')
        var backgroundClouds = this.game.add.sprite(0, 0, 'clouds')
        this.deity = this.game.add.sprite(-10, 100, 'dude')

        this.title = this.makeLabel(451, 100, 'DEITY IN TRAINING')
        this.title.fontSize = 36
        this.title.fill = 'yellow'
        this.title.align = 'center'
        this.title.strokeThickness = 4

        this.subTitle = this.makeLabel(451, 150, 'The Big Boss is Away')
        this.subTitle.fontSize = 22
        this.subTitle.fill = 'yellow'
        this.subTitle.align = 'center'
        this.subTitle.strokeThickness = 4

        this.subSubTitle = this.makeLabel(451, 180, 'Steer this Small World through its Tribulations')
        this.subSubTitle.fontSize = 22
        this.subSubTitle.fill = 'yellow'
        this.subSubTitle.align = 'center'
        this.subSubTitle.strokeThickness = 4

        this.subSubSubTitle = this.makeLabel(451, 320, 'Press (Space) to Play')
        this.subSubSubTitle.fontSize = 20

        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.game.world.bringToTop(this.deity)
    }

    private playKaboom = () => {
        this.game.add.audio('explode').play()
        this.planet.achievement *= 0.5
    }

    private playWoot = () => {
        this.game.add.audio('achieve').play()
        var ach = this.planet.getAchievement()
        this.achievementText.setText(ach.description)
        this.achievementBlurb.setText(ach.blurb)
    }

    private playFail = () => {
        this.game.add.audio('hurt').play()
        var ach = this.planet.getAchievement()
        this.achievementText.setText(ach.description)
        this.achievementBlurb.setText(ach.blurb)
    }

    private playCoin = () => {
        this.game.add.audio('coin').play()
        this.planet.temperament += 5
    }

    private rollDie = (sides: number) => Math.floor(Math.random() * sides)


    public update = () => {
        // Always update deity
        this.deity.x = 25 * Math.cos(this.t) + 10
        this.deity.y = 10 * Math.sin(this.t) + 80
        this.t += Math.random() / 50

        switch (this.state) {
            case GameStates.titleScreen:
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    // TODO: spiffy cool startup sound
                    this.startGame()
                }
                break;
            case GameStates.gameOn:

                // Update comets
                for (var i in this.comets) {
                    this.comets[i].update()
                }
                if ((this.comets.length < 4) && this.rollDie(200) === 0) {
                    this.comets.push(new Comet(this.game, this.playKaboom))
                }
                this.comets = this.comets.filter(i => !i.isDead)

                // Update manna
                for (var i in this.manna) {
                    this.manna[i].update()
                }
                this.manna = this.manna.filter(i => !i.isDead)
                if (this.rollDie(200) === 0) this.manna.push(new Manna(this.game, this.playCoin))

                // Update planet
                this.planet.update()

                if (this.cursors.left.isDown) {
                    this.planet.sprite.body.velocity.x -= 2
                }
                else if (this.cursors.right.isDown) {
                    this.planet.sprite.body.velocity.x += 2
                }
                break;
            case GameStates.victory:
                break
            case GameStates.timeOut:
                break;
            default:
                break;
        }




    }

    public render = () => {
        if (this.state === GameStates.gameOn) {
            var calvins = new Phaser.Rectangle(875, 30, 100, 20)
            this.game.debug.geom(calvins, '#cccccc', false)
            this.game.debug.text(this.planet.temperament.toFixed(2), 875, 50)

            var kelvins = new Phaser.Rectangle(875, 520, 100, 20)
            this.game.debug.geom(kelvins, '#cccccc', false)
            this.game.debug.text(this.planet.temperature.toFixed(2), 875, 540)

        }
    }


}