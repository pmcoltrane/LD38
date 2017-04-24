var Comet = (function () {
    function Comet(game, collisionCallback) {
        var _this = this;
        this.onCollision = function (body, bodyB, shapeA, shapeB, equation) {
            if (body && body.key && body.key === 'planet') {
                _this.isDead = true;
                if (_this.collisionCallback)
                    _this.collisionCallback();
            }
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
        //FIXME: better calcs. these were trial/error
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
achievements.push({ value: -1e9, description: 'Magnificent Desolation', blurb: 'Protect this fledgling planet from the onslaught of comets.' });
achievements.push({ value: 200, description: 'A Day at the Beach', blurb: 'Mighty oceans have formed on this little world.' });
achievements.push({ value: 400, description: 'Land Ho', blurb: 'Great continents have broken through the ocean surface.' });
achievements.push({ value: 550, description: 'Sugar, Salt, and Fat', blurb: 'A promising brew of organic chemicals is forming.' });
achievements.push({ value: 650, description: 'Montezuma\'s Revenge', blurb: 'In the primordial oceans, primitive cells have formed.' });
achievements.push({ value: 800, description: 'Wriggly Worms', blurb: 'Early animal life has arisen on the tiny world.' });
achievements.push({ value: 1000, description: 'Fishsticks', blurb: 'Time for a fish fry? These cramped oceans are teeming with life.' });
achievements.push({ value: 1200, description: 'Creepy Crawlers', blurb: 'Little lifeforms have crawled onto the tiny shore.' });
achievements.push({ value: 1500, description: 'Thunder Lizards', blurb: 'These tyrannical monsters seem oversized for this minuscule sphere.' });
achievements.push({ value: 2250, description: 'Clever Monkeys', blurb: 'Ook! Ook! The inhabitants of this little rock are banging littler rocks together.' });
achievements.push({ value: 2800, description: 'Prattling Philosophers', blurb: 'Latinate cogitators aduancing knouuledge across this diminutive orb.' });
achievements.push({ value: 3400, description: 'Crazy Mad Scientists', blurb: 'Men in white lab coats burn Bunsen and coil Tesla in their zany experiments.' });
achievements.push({ value: 3800, description: 'One Billion Cat Memes', blurb: 'Ceiling cat smiles upon ur teensy world. U can haz hugz.' });
achievements.push({ value: 4500, description: 'Singularity Next Sunday', blurb: 'How will the technological apotheosis transfigure this pint-sized world?' });
achievements.push({ value: 5500, description: 'It\'s the Apocalypse', blurb: 'It was a small world, after all.' });
achievements.reverse();
var Game = (function () {
    function Game(elementId) {
        var _this = this;
        this.comets = [];
        this.manna = [];
        this.createUI = function () {
            var makeLabel = function (x, y, text) {
                var lbl = _this.game.add.text(x, y, text);
                lbl.stroke = '#000000';
                lbl.fill = '#ffffff';
                lbl.strokeThickness = 2;
                lbl.fontSize = 16;
                return lbl;
            };
            _this.temperatureLabel = makeLabel(875, 500, 'TEMPERATURE');
            _this.temperamentLabel = makeLabel(875, 10, 'TEMPERAMENT');
            _this.achievementLabel = makeLabel(10, 500, 'PINNACLE ACHIEVEMENT');
            _this.achievementText = makeLabel(10, 520, '- UNKNOWN -');
            _this.achievementText.fontSize = 12;
            _this.achievementBlurb = makeLabel(10, 540, '- UNKNOWN -');
            _this.achievementBlurb.fontSize = 12;
            var ach = _this.planet.getAchievement();
            _this.achievementText.setText(ach.description);
            _this.achievementBlurb.setText(ach.blurb);
        };
        this.preload = function () {
            _this.game.load.image('space', 'assets/space.png');
            _this.game.load.image('clouds', 'assets/fluffy-clouds.png');
            _this.game.load.image('ball', 'assets/planet-0.png');
            _this.game.load.image('comet', 'assets/comet.png');
            _this.game.load.image('dude', 'assets/dude.png');
            _this.game.load.image('heart', 'assets/heart.png');
            _this.game.load.audio('explode', 'assets/explode.wav');
            _this.game.load.audio('achieve', 'assets/achieve.wav');
            _this.game.load.audio('hurt', 'assets/hurt.wav');
            _this.game.load.audio('coin', 'assets/coin.wav');
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
            _this.deity = _this.game.add.sprite(-10, 100, 'dude');
            var comet = new Comet(_this.game, _this.playKaboom);
            _this.comets.push(comet);
            _this.planet = new Planet(_this.game, _this.playWoot, _this.playFail);
            _this.game.physics.p2.setWorldMaterial(worldMaterial, false, false, false, false);
            _this.game.physics.p2.setBoundsToWorld(false, false, false, false);
            _this.cursors = _this.game.input.keyboard.createCursorKeys();
            _this.createUI();
        };
        this.playKaboom = function () {
            _this.game.add.audio('explode').play();
            _this.planet.achievement *= 0.5;
        };
        this.playWoot = function () {
            _this.game.add.audio('achieve').play();
            var ach = _this.planet.getAchievement();
            _this.achievementText.setText(ach.description);
            _this.achievementBlurb.setText(ach.blurb);
        };
        this.playFail = function () {
            _this.game.add.audio('hurt').play();
            var ach = _this.planet.getAchievement();
            _this.achievementText.setText(ach.description);
            _this.achievementBlurb.setText(ach.blurb);
        };
        this.playCoin = function () {
            _this.game.add.audio('coin').play();
            _this.planet.temperament += 5;
        };
        this.rollDie = function (sides) { return Math.floor(Math.random() * sides); };
        this.update = function () {
            // Update comets
            for (var i in _this.comets) {
                _this.comets[i].update();
            }
            if ((_this.comets.length < 4) && _this.rollDie(200) === 0) {
                _this.comets.push(new Comet(_this.game, _this.playKaboom));
            }
            _this.comets = _this.comets.filter(function (i) { return !i.isDead; });
            // Update manna
            for (var i in _this.manna) {
                _this.manna[i].update();
            }
            _this.manna = _this.manna.filter(function (i) { return !i.isDead; });
            if (_this.rollDie(200) === 0)
                _this.manna.push(new Manna(_this.game, _this.playCoin));
            _this.deity.x = 25 * Math.cos(_this.t) + 10;
            _this.deity.y = 10 * Math.sin(_this.t) + 80;
            _this.t += Math.random() / 50;
            _this.planet.update();
            if (_this.cursors.left.isDown) {
                _this.planet.sprite.body.velocity.x -= 2;
            }
            else if (_this.cursors.right.isDown) {
                _this.planet.sprite.body.velocity.x += 2;
            }
        };
        this.render = function () {
            _this.game.debug.text(_this.planet.temperature.toFixed(2), 875, 540);
            _this.game.debug.text(_this.planet.temperament.toFixed(2), 875, 50);
        };
        this.game = new Phaser.Game(1024, 576, Phaser.CANVAS, elementId, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
        this.t = 0;
    }
    return Game;
}());
/// <reference path="../typings/index.d.ts" />
var game;
function main() {
    game = new Game('');
}
var Manna = (function () {
    function Manna(game, collisionCallback) {
        var _this = this;
        this.onCollision = function (body, bodyB, shapeA, shapeB, equation) {
            if (body.key === 'planet') {
                _this.isDead = true;
                if (_this.collisionCallback)
                    _this.collisionCallback();
            }
        };
        this.update = function () {
            if (_this.sprite.y > (288 - 16)) {
                _this.isDead = true;
            }
            if (_this.isDead)
                _this.sprite.destroy();
        };
        var x = Math.random() * 1024;
        var y = -50 * Math.random();
        var sprite = game.add.sprite(x, y, 'heart');
        sprite.width = 32;
        sprite.height = 32;
        game.physics.p2.enable(sprite);
        sprite.body.mass = 1;
        sprite.body.setCircle(16);
        sprite.body.damping = 0.1;
        sprite.body.onBeginContact.add(this.onCollision);
        this.sprite = sprite;
        this.collisionCallback = collisionCallback;
    }
    return Manna;
}());
var Planet = (function () {
    function Planet(game, levelUp, levelDown) {
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
                _this.temperament += (_this.temperament * 0.002);
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
            // Update achievement
            var ach = _this.getAchievement();
            if (ach != _this.lastAchievement) {
                if (_this.lastAchievement.value > ach.value) {
                    // we dropped a level or more
                    if (_this.levelDown)
                        _this.levelDown();
                }
                else {
                    // we leveled up
                    if (_this.levelUp)
                        _this.levelUp();
                }
                _this.lastAchievement = ach;
            }
        };
        this.lastAchievement = achievements[achievements.length - 1];
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
        sprite.body.key = 'planet';
        this.levelUp = levelUp;
        this.levelDown = levelDown;
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
    Planet.prototype.getAchievement = function () {
        for (var i in achievements)
            if (achievements[i].value <= this.achievement)
                return achievements[i];
        return achievements[achievements.length - 1];
    };
    return Planet;
}());
