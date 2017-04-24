class Game {

    private game: Phaser.Game
    private planet: Planet
    private cursors: Phaser.CursorKeys
    private comets: Comet[] = []

    constructor(elementId: string) {
        this.game = new Phaser.Game(1024, 576, Phaser.CANVAS, elementId, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        })
    }

    public preload = () => {
        this.game.load.image('space', 'assets/space.png')
        this.game.load.image('clouds', 'assets/fluffy-clouds.png')
        this.game.load.image('ball', 'assets/planet-0.png')
        this.game.load.image('comet', 'assets/comet.png')
        this.game.load.image('dude', 'assets/dude.png')
        this.game.load.audio('explode', 'assets/explode.wav')
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
        var dude = this.game.add.sprite(-10, 100, 'dude')

        var comet = new Comet(this.game, this.playKaboom)
        this.comets.push(comet)

        this.planet = new Planet(this.game)
        this.game.physics.p2.setWorldMaterial(worldMaterial, false, false, false, false)
        this.game.physics.p2.setBoundsToWorld(false, false, false, false)
        this.cursors = this.game.input.keyboard.createCursorKeys()

    }

    private playKaboom = () => {
        this.game.add.audio('explode').play()
        this.planet.achievement *= 0.5
    }

    public update = () => {
        // // Adjust temperature toward expected value for this distance
        // var x = this.planet.sprite.x
        // var xAdjusted = (x / 1024) - 0.5

        // var tExpected = (xAdjusted / (1 + xAdjusted * xAdjusted)) * 3
        // var dt = (this.planet.temperature - tExpected)
        // this.planet.temperature -= (dt / 10)

        // // Decay temperament
        // if(Math.abs(this.planet.temperature) >= 0.6) this.planet.achievement -= (1 + this.planet.temperament / 10)
        // this.planet.temperament = Math.max(this.planet.temperament * 0.999, 0.01)
        // this.planet.achievement += this.planet.temperament / 10
        // if(this.planet.achievement < 0) this.planet.achievement = 0

        // Update comets
        for(var i in this.comets){
            this.comets[i].update()
            if(this.comets[i].isDead) this.comets[i] = new Comet(this.game, this.playKaboom)
        }

        this.planet.update()

        if (this.cursors.left.isDown) {
            this.planet.sprite.body.velocity.x -= 2
        }
        else if (this.cursors.right.isDown) {
            this.planet.sprite.body.velocity.x += 2
        }

    }

    public render = () => {
        this.game.debug.text('Temperature: ' + this.planet.temperature.toFixed(2), 32, 32)
        this.game.debug.text('Temperament: ' + this.planet.temperament.toFixed(2), 32, 64)
        this.game.debug.text('Achievement: ' + this.planet.getAchievementDescription() + ' (' + this.planet.achievement.toFixed(2) + ')', 32, 96)
    }

}