var Comet = (function () {
    function Comet(game, collisionCallback) {
        var _this = this;
        this.onCollision = function (body, bodyB, shapeA, shapeB, equation) {
            _this.isDead = true;
            if (_this.collisionCallback)
                _this.collisionCallback();
        };
        this.update = function () {
            if (_this.sprite.y > 660)
                _this.isDead = true;
            if (_this.sprite.x > 1024)
                _this.isDead = true;
            if (_this.isDead)
                _this.sprite.destroy();
        };
        var x = Math.random() * 500;
        var y = 660;
        var sprite = game.add.sprite(x, y, 'comet');
        sprite.width = 64;
        sprite.height = 64;
        game.physics.p2.enable(sprite);
        sprite.body.mass = 1;
        sprite.body.setCircle(16, 18, -18);
        sprite.body.fixedRotation = true;
        //TODO: don't launch all the comets identically
        var theta = Math.PI / 4;
        var vel = 100;
        sprite.body.velocity.x = 20 + 30 * Math.random();
        sprite.body.velocity.y = -78;
        sprite.body.damping = 0;
        sprite.body.onBeginContact.add(this.onCollision);
        this.sprite = sprite;
        this.collisionCallback = collisionCallback;
    }
    return Comet;
}());
var achievements = [];
achievements.push({ value: -1e9, description: 'Magnificent Desolation' });
achievements.push({ value: 100, description: 'A Day at the Beach' });
achievements.push({ value: 200, description: 'Land Ho' });
achievements.push({ value: 300, description: 'Sugar, Salt, and Fat' });
achievements.push({ value: 500, description: 'Montezuma\'s Revenge' });
achievements.push({ value: 800, description: 'Wriggly Worms' });
achievements.push({ value: 1300, description: 'Fishsticks' });
achievements.push({ value: 2100, description: 'Creepy Crawlers' });
achievements.push({ value: 3400, description: 'Thunder Lizards' });
achievements.push({ value: 5500, description: 'Clever Monkeys' });
achievements.push({ value: 8900, description: 'Prattling Philosophers' });
achievements.push({ value: 14400, description: 'Crazy Mad Scientists' });
achievements.push({ value: 23300, description: 'One Billion Cat Memes' });
achievements.push({ value: 37700, description: 'Singularity Next Sunday' });
achievements.push({ value: 61000, description: 'It\'s the Apocalypse' });
achievements.reverse();
var Game = (function () {
    function Game(elementId) {
        var _this = this;
        this.comets = [];
        this.preload = function () {
            _this.game.load.image('space', 'assets/space.png');
            _this.game.load.image('clouds', 'assets/fluffy-clouds.png');
            _this.game.load.image('ball', 'assets/planet-0.png');
            _this.game.load.image('comet', 'assets/comet.png');
            _this.game.load.image('dude', 'assets/dude.png');
            _this.game.load.audio('explode', 'assets/explode.wav');
        };
        this.create = function () {
            _this.game.physics.startSystem(Phaser.Physics.P2JS);
            _this.game.physics.p2.gravity.y = 10;
            _this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            _this.game.physics.p2.world.setGlobalStiffness(1e5);
            var worldMaterial = _this.game.physics.p2.createMaterial('worldMaterial');
            var ballMaterial = _this.game.physics.p2.createMaterial('ballMaterial');
            var background = _this.game.add.sprite(0, 288, 'space');
            var backgroundClouds = _this.game.add.sprite(0, 0, 'clouds');
            var dude = _this.game.add.sprite(-10, 100, 'dude');
            //for (var i = 0; i < 1; i++) {
            var comet = new Comet(_this.game, _this.playKaboom);
            _this.comets.push(comet);
            //}
            _this.planet = new Planet(_this.game);
            _this.game.physics.p2.setWorldMaterial(worldMaterial, false, false, false, false);
            _this.game.physics.p2.setBoundsToWorld(false, false, false, false);
            _this.cursors = _this.game.input.keyboard.createCursorKeys();
        };
        this.playKaboom = function () {
            _this.game.add.audio('explode').play();
            _this.planet.achievement *= 0.5;
        };
        this.update = function () {
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
            for (var i in _this.comets) {
                _this.comets[i].update();
                if (_this.comets[i].isDead)
                    _this.comets[i] = new Comet(_this.game, _this.playKaboom);
            }
            _this.planet.update();
            if (_this.cursors.left.isDown) {
                _this.planet.sprite.body.velocity.x -= 2;
            }
            else if (_this.cursors.right.isDown) {
                _this.planet.sprite.body.velocity.x += 2;
            }
        };
        this.render = function () {
            _this.game.debug.text('Temperature: ' + _this.planet.temperature.toFixed(2), 32, 32);
            _this.game.debug.text('Temperament: ' + _this.planet.temperament.toFixed(2), 32, 64);
            _this.game.debug.text('Achievement: ' + _this.planet.getAchievementDescription() + ' (' + _this.planet.achievement.toFixed(2) + ')', 32, 96);
        };
        this.game = new Phaser.Game(1024, 576, Phaser.CANVAS, elementId, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    }
    return Game;
}());
/// <reference path="../typings/index.d.ts" />
var game;
function main() {
    game = new Game('');
}
var Planet = (function () {
    function Planet(game) {
        var _this = this;
        this.update = function () {
            // Adjust temperature toward expected value for this distance.
            var x = _this.sprite.x;
            var xAdjusted = (x / 1024) - 0.5;
            var tExpected = (xAdjusted / (1 + xAdjusted * xAdjusted)) * 3;
            var dt = (_this.temperature - tExpected);
            _this.temperature -= (dt / 10);
            // Adjust temperament for temperature
            var tAbs = Math.abs(_this.temperature);
            if ((0.4 <= tAbs) && (tAbs <= 0.6)) {
                // A little extreme boosts temperament
                _this.temperament = Math.min(_this.temperament * 1.002, 10);
            }
            else if (tAbs > 0.6) {
                // But too extreme kills achievement
                _this.achievement -= (1 + _this.temperament / 10);
            }
            // Decay temperament
            _this.temperament = Math.max(_this.temperament * 0.999, 0.05);
            if (_this.achievement < 0)
                _this.achievement = 0;
            _this.achievement += _this.temperament / 10;
            // Fix y-position and motion
            _this.sprite.body.velocity.y = 0;
            _this.sprite.body.y = 288;
            if (_this.sprite.body.x < 100) {
                _this.sprite.body.x = 100;
                _this.sprite.body.velocity.x = 0;
            }
            else if (_this.sprite.body.x > 924) {
                _this.sprite.body.x = 924;
                _this.sprite.body.velocity.x = 0;
            }
        };
        var ballMaterial = game.physics.p2.createMaterial('ballMaterial');
        var sprite = game.add.sprite(512, 288, 'ball');
        sprite.width = 128;
        sprite.height = 128;
        game.physics.p2.enable(sprite);
        sprite.body.mass = 1;
        sprite.body.gravityScale = -1;
        sprite.body.setMaterial(ballMaterial);
        sprite.body.angularVelocity = 120 * Math.PI / 180;
        sprite.body.angularDamping = 0;
        sprite.body.setCircle(64);
        sprite.body.fixedY = true;
        this.sprite = sprite;
        this.material = ballMaterial;
        this.temperature = 0;
        this.temperament = 5;
        this.achievement = 0;
    }
    Planet.prototype.getAchievementDescription = function () {
        for (var i in achievements)
            if (achievements[i].value <= this.achievement)
                return achievements[i].description;
        return 'In-Game Fail';
    };
    return Planet;
}());
