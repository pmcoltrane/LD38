class Manna{
    private collisionCallback:Function

    public sprite:Phaser.Sprite
    public material:Phaser.Physics.P2.Material

    public isDead:boolean 

    constructor(game:Phaser.Game, collisionCallback:Function){
        var x = Math.random() * 1024
        var y = -50 * Math.random()
        var sprite = game.add.sprite(x, y, 'heart')
        sprite.width = 32
        sprite.height = 32

        game.physics.p2.enable(sprite)
        sprite.body.mass = 1
        sprite.body.setCircle(16)
        sprite.body.damping = 0.1
        sprite.body.onBeginContact.add(this.onCollision)

        this.sprite = sprite
        this.collisionCallback = collisionCallback
    }

    public onCollision = (body, bodyB, shapeA, shapeB, equation) => {
        if(body && body.key && body.key === 'planet'){
            this.isDead = true
            if(this.collisionCallback) this.collisionCallback()
        }
    }

    public update = () => {
        if(this.sprite.y > (288-16)){
            this.isDead = true
        }
        if(this.isDead) this.sprite.destroy()
    }
}