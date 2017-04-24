class Planet{
    private levelUp:Function
    private levelDown:Function

    public sprite:Phaser.Sprite
    public material:Phaser.Physics.P2.Material

    public temperature:number   // roughly -1 to 1
    public temperament:number   // 0 to 10

    public achievement:number

    private lastAchievement:Achievement

    public getAchievementDescription():string{
        for(var i in achievements) if(achievements[i].value <= this.achievement) return achievements[i].description
        return 'In-Game Fail'
    }

    public getAchievement():Achievement{
        for(var i in achievements) if (achievements[i].value <= this.achievement) return achievements[i]
        return achievements[achievements.length - 1]
    }

    constructor(game:Phaser.Game, levelUp:Function, levelDown:Function){
        this.lastAchievement = achievements[achievements.length - 1]
        var ballMaterial = game.physics.p2.createMaterial('ballMaterial')

        var sprite = game.add.sprite(512, 288, 'ball')
        sprite.width= 128
        sprite.height = 128
        game.physics.p2.enable(sprite)
        sprite.body.mass = 1
        sprite.body.gravityScale = -1
        sprite.body.setMaterial(ballMaterial)
        sprite.body.angularVelocity = 120 * Math.PI/180
        sprite.body.angularDamping = 0
        sprite.body.setCircle(64)
        sprite.body.fixedY = true
        sprite.body.key = 'planet'

        this.levelUp = levelUp
        this.levelDown = levelDown
        this.sprite = sprite
        this.material = ballMaterial
        this.temperature = 0
        this.temperament = 5
        this.achievement = 0
    }

    public update = () => {
        // Adjust temperature toward expected value for this distance.
        var x = this.sprite.x
        var xAdjusted = (x / 1024) - 0.5

        var tExpected = (xAdjusted / (1 + xAdjusted * xAdjusted)) * 3
        var dt = (this.temperature - tExpected)
        this.temperature -= (dt / 10)

        // Adjust temperament for temperature
        var tAbs = Math.abs(this.temperature)
        if((0.4 <= tAbs) && (tAbs <= 0.6)){
            // A little extreme boosts temperament
            this.temperament += (this.temperament * 0.002)
        }
        else if(tAbs > 0.6){
            // But too extreme kills achievement
            this.achievement -= (1 + this.temperament / 10)
        }

        // Decay temperament
        this.temperament = Math.min(Math.max(this.temperament * 0.999, 0.1), 20)
        if(this.achievement <0) this.achievement = 0
        this.achievement += this.temperament / 10

        // Fix y-position and motion
        this.sprite.body.velocity.y = 0
        this.sprite.body.y = 288
        if(this.sprite.body.x < 100){
            this.sprite.body.x = 100
            this.sprite.body.velocity.x = 0
        }
        else if(this.sprite.body.x > 924){
            this.sprite.body.x = 924
            this.sprite.body.velocity.x = 0
        }

        // Update achievement
        var ach = this.getAchievement()
        if(ach != this.lastAchievement){
            if(this.lastAchievement.value > ach.value){
                // we dropped a level or more
                if(this.levelDown) this.levelDown()
            }
            else{
                // we leveled up
                if(this.levelUp) this.levelUp()
            }
            this.lastAchievement = ach
        }
    }

}
