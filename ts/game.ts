class Game {

    private game: Phaser.Game
    private planet: Planet
    private cursors: Phaser.CursorKeys
    private comets: Comet[] = []
    private deity: Phaser.Sprite

    private temperatureLabel: Phaser.Text
    private temperamentLabel: Phaser.Text
    private achievementLabel: Phaser.Text

    private achievementText: Phaser.Text
    private achievementBlurb: Phaser.Text

    private t:number

    constructor(elementId: string) {
        this.game = new Phaser.Game(1024, 576, Phaser.CANVAS, elementId, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        })
        this.t = 0
    }

    private createUI = () => {
        var makeLabel = (x, y, text):Phaser.Text => {
            var lbl = this.game.add.text(x, y, text)
            lbl.stroke = '#000000'
            lbl.fill = '#ffffff'
            lbl.strokeThickness = 2
            lbl.fontSize = 16

            return lbl
        }

        this.temperatureLabel = makeLabel(875, 500, 'TEMPERATURE')
        this.temperamentLabel = makeLabel(875, 10, 'TEMPERAMENT')
        this.achievementLabel = makeLabel(10, 500, 'PINNACLE ACHIEVEMENT')

        this.achievementText = makeLabel(10, 520, '- UNKNOWN -')
        this.achievementText.fontSize = 12
        
        this.achievementBlurb =makeLabel(10, 540, '- UNKNOWN -')
        this.achievementBlurb.fontSize = 12

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
        this.game.load.audio('explode', 'assets/explode.wav')
        this.game.load.audio('achieve', 'assets/achieve.wav')
        this.game.load.audio('hurt', 'assets/hurt.wav')
    }
    public create = () => {
        
        this.game.physics.startSystem(Phaser.Physics.P2JS)
        this.game.physics.p2.gravity.y = 10
        this.game.physics.p2.world.defaultContactMaterial.friction = 0.3
        this.game.physics.p2.world.setGlobalStiffness(1e5)

        var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial')
        var ballMaterial = this.game.physics.p2.createMaterial('ballMaterial')

        var background = this.game.add.sprite(0, 288, 'space')
        var backgroundClouds = this.game.add.sprite(0, 0, 'clouds')
        this.deity = this.game.add.sprite(-10, 100, 'dude')

        var comet = new Comet(this.game, this.playKaboom)
        this.comets.push(comet)

        this.planet = new Planet(this.game, this.playWoot, this.playFail)
        this.game.physics.p2.setWorldMaterial(worldMaterial, false, false, false, false)
        this.game.physics.p2.setBoundsToWorld(false, false, false, false)
        this.cursors = this.game.input.keyboard.createCursorKeys()

        this.createUI()
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

    public update = () => {

        // Update comets
        for(var i in this.comets){
            this.comets[i].update()
            if(this.comets[i].isDead) this.comets[i] = new Comet(this.game, this.playKaboom)
        }

        this.deity.x = 25 * Math.cos(this.t) + 10
        this.deity.y = 10 * Math.sin(this.t) + 80
        this.t += Math.random() / 50

        this.planet.update()

        if (this.cursors.left.isDown) {
            this.planet.sprite.body.velocity.x -= 2
        }
        else if (this.cursors.right.isDown) {
            this.planet.sprite.body.velocity.x += 2
        }

    }

    public render = () => {
        this.game.debug.text(this.planet.temperature.toFixed(2), 875, 540)
        this.game.debug.text(this.planet.temperament.toFixed(2), 875, 50)
    }

}