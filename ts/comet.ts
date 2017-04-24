class Comet{
    private collisionCallback:Function

    public sprite:Phaser.Sprite
    public material:Phaser.Physics.P2.Material

    public isDead:boolean

    constructor(game:Phaser.Game, collisionCallback:Function){
        var x = Math.random() * 500
        var y = 660
        var sprite = game.add.sprite(x, y, 'comet')
        sprite.width = 64
        sprite.height = 64

        game.physics.p2.enable(sprite)
        sprite.body.mass = 1
        sprite.body.setCircle(16, 18, -18)
        sprite.body.fixedRotation = true

        //FIXME: better calcs. these were trial/error
        sprite.body.velocity.x = 20 + 30 * Math.random()
        sprite.body.velocity.y = -78
        sprite.body.damping = 0
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
        if(this.sprite.y > 660) this.isDead = true
        if(this.sprite.y < 288) this.isDead = true
        if(this.sprite.x > 1024) this.isDead = true
        if(this.isDead) this.sprite.destroy()
    }

}