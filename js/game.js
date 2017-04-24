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
            if (_this.sprite.y < 288)
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
achievements.push({ value: 2800, description: 'Prattling Philosophers', blurb: 'Uuell-read Latin cogitators aduance knouuledge across this diminutive orb.' });
achievements.push({ value: 3400, description: 'Crazy Mad Scientists', blurb: 'Men in white lab coats burn Bunsen and coil Tesla in their zany experiments.' });
achievements.push({ value: 3800, description: 'One Billion Cat Memes', blurb: 'Ceiling cat smiles upon ur teensy world. U can haz hugz.' });
achievements.push({ value: 4500, description: 'Singularity Next Sunday', blurb: 'How will the technological apotheosis transfigure this pint-sized world?' });
achievements.push({ value: 5500, description: 'It\'s the Apocalypse', blurb: 'It was a small world, after all.' });
achievements.reverse();
var GameStates;
(function (GameStates) {
    GameStates[GameStates["titleScreen"] = 0] = "titleScreen";
    GameStates[GameStates["gameOn"] = 1] = "gameOn";
    GameStates[GameStates["victory"] = 2] = "victory";
    GameStates[GameStates["timeOut"] = 3] = "timeOut";
})(GameStates || (GameStates = {}));
var Game = (function () {
    function Game(elementId) {
        var _this = this;
        this.comets = [];
        this.manna = [];
        this.state = GameStates.titleScreen;
        this.makeLabel = function (x, y, text) {
            var lbl = _this.game.add.text(x, y, text);
            lbl.stroke = '#000000';
            lbl.fill = '#ffffff';
            lbl.strokeThickness = 2;
            lbl.fontSize = 16;
            return lbl;
        };
        this.createUI = function () {
            _this.title.destroy();
            _this.subTitle.destroy();
            _this.subSubTitle.destroy();
            _this.subSubSubTitle.destroy();
            _this.temperatureLabel = _this.makeLabel(875, 500, 'TEMPERATURE');
            _this.temperamentLabel = _this.makeLabel(875, 10, 'TEMPERAMENT');
            _this.achievementLabel = _this.makeLabel(10, 500, 'PINNACLE ACHIEVEMENT');
            _this.achievementText = _this.makeLabel(10, 520, '- UNKNOWN -');
            _this.achievementText.fontSize = 12;
            _this.achievementBlurb = _this.makeLabel(10, 540, '- UNKNOWN -');
            _this.achievementBlurb.fontSize = 12;
        };
        this.startGame = function () {
            _this.game.add.audio('thrum').play();
            _this.game.physics.startSystem(Phaser.Physics.P2JS);
            _this.game.physics.p2.gravity.y = 10;
            _this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            _this.game.physics.p2.world.setGlobalStiffness(1e5);
            _this.game.physics.p2.setBoundsToWorld(false, false, false, false);
            var comet = new Comet(_this.game, _this.playKaboom);
            _this.comets.push(comet);
            _this.planet = new Planet(_this.game, _this.playWoot, _this.playFail);
            _this.createUI();
            _this.updateAchievement();
            _this.game.world.bringToTop(_this.deity);
            _this.state = GameStates.gameOn;
        };
        this.showVictory = function () {
            _this.state = GameStates.victory;
            _this.game.add.audio('warble').play();
            // Cleanup
            for (var i in _this.manna) {
                _this.manna[i].sprite.destroy();
            }
            _this.manna = [];
            for (var i in _this.comets) {
                _this.comets[i].sprite.destroy();
            }
            _this.comets = [];
            // Show stupid victory message
            _this.title = _this.makeLabel(451, 100, 'DEITY! YOU WIN!');
            _this.title.fontSize = 36;
            _this.title.fill = 'yellow';
            _this.title.align = 'center';
            _this.title.strokeThickness = 4;
            _this.subTitle = _this.makeLabel(451, 150, 'Your little world survived big dangers.');
            _this.subTitle.fontSize = 22;
            _this.subTitle.fill = 'yellow';
            _this.subTitle.align = 'center';
            _this.subTitle.strokeThickness = 4;
            _this.subSubTitle = _this.makeLabel(451, 180, 'But the Big Boss decided it\'s time for an Apocalypse');
            _this.subSubTitle.fontSize = 22;
            _this.subSubTitle.fill = 'yellow';
            _this.subSubTitle.align = 'center';
            _this.subSubTitle.strokeThickness = 4;
            _this.subSubSubTitle = _this.makeLabel(451, 320, 'It\'s The End of the World As We Know It.');
            _this.subSubSubTitle.fontSize = 20;
            _this.subSubSubTitle.alpha = 0;
            _this.subSubSubTitle.stroke = 'white';
            _this.subSubSubTitle.fill = 'black';
            var tween = _this.game.add.tween(_this.subSubSubTitle).to({ alpha: 1 }, 500, "Linear", true);
            tween.yoyo(true, 0).repeat(-1);
        };
        this.updateAchievement = function () {
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
            _this.game.load.audio('thrum', 'assets/thrum.wav');
            _this.game.load.audio('warble', 'assets/warble.wav');
            _this.game.load.audio('theme', 'assets/theme.ogg');
        };
        this.create = function () {
            var music = _this.game.add.audio('theme', 1, true);
            music.play();
            var background = _this.game.add.sprite(0, 288, 'space');
            var backgroundClouds = _this.game.add.sprite(0, 0, 'clouds');
            _this.deity = _this.game.add.sprite(-10, 100, 'dude');
            _this.title = _this.makeLabel(451, 100, 'DEITY IN TRAINING');
            _this.title.fontSize = 36;
            _this.title.fill = 'yellow';
            _this.title.align = 'center';
            _this.title.strokeThickness = 4;
            _this.subTitle = _this.makeLabel(451, 150, 'The Big Boss is Away');
            _this.subTitle.fontSize = 22;
            _this.subTitle.fill = 'yellow';
            _this.subTitle.align = 'center';
            _this.subTitle.strokeThickness = 4;
            _this.subSubTitle = _this.makeLabel(451, 180, 'Steer this Small World through its Tribulations');
            _this.subSubTitle.fontSize = 22;
            _this.subSubTitle.fill = 'yellow';
            _this.subSubTitle.align = 'center';
            _this.subSubTitle.strokeThickness = 4;
            _this.subSubSubTitle = _this.makeLabel(451, 320, 'Press (Space) to Play');
            _this.subSubSubTitle.fontSize = 20;
            _this.subSubSubTitle.alpha = 0;
            _this.subSubSubTitle.stroke = 'white';
            _this.subSubSubTitle.fill = 'black';
            var tween = _this.game.add.tween(_this.subSubSubTitle).to({ alpha: 1 }, 500, "Linear", true);
            tween.yoyo(true, 0).repeat(-1);
            _this.cursors = _this.game.input.keyboard.createCursorKeys();
            _this.game.world.bringToTop(_this.deity);
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
            // Always update deity
            _this.deity.x = 25 * Math.cos(_this.t) + 10;
            _this.deity.y = 10 * Math.sin(_this.t) + 80;
            _this.t += Math.random() / 50;
            switch (_this.state) {
                case GameStates.titleScreen:
                    if (_this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                        // TODO: spiffy cool startup sound
                        _this.startGame();
                    }
                    break;
                case GameStates.gameOn:
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
                    // Update planet
                    _this.planet.update();
                    if (_this.cursors.left.isDown) {
                        _this.planet.sprite.body.velocity.x -= 2;
                    }
                    else if (_this.cursors.right.isDown) {
                        _this.planet.sprite.body.velocity.x += 2;
                    }
                    // Check for victory
                    if (_this.planet.getAchievement() === achievements[0]) {
                        _this.showVictory();
                    }
                    break;
                case GameStates.victory:
                    break;
                case GameStates.timeOut:
                    break;
                default:
                    break;
            }
        };
        this.render = function () {
            if (_this.state === GameStates.gameOn) {
                var calvins = new Phaser.Rectangle(875, 30, 102, 20);
                var temperament = _this.planet.temperament;
                var cv = Math.min(temperament / 20, 1) * 100;
                var cvRect = new Phaser.Rectangle(876, 31, cv, 18);
                var cvColor;
                if (temperament < 5)
                    cvColor = 'red';
                else if (temperament < 10)
                    cvColor = 'yellow';
                else
                    cvColor = 'lime';
                _this.game.debug.geom(cvRect, cvColor, true);
                _this.game.debug.geom(calvins, '#cccccc', false);
                //this.game.debug.text(this.planet.temperament.toFixed(2), 875, 50)
                var kelvins = new Phaser.Rectangle(875, 520, 102, 20);
                var temperature = _this.planet.temperature;
                var temperatureAbs = Math.abs(temperature);
                var kv = temperature * 50;
                kv = (kv < 0) ? Math.max(-50, kv) : Math.min(50, kv);
                var kvRect = new Phaser.Rectangle(876 + 50, 521, kv, 18);
                var kvColor;
                if (temperatureAbs < 0.4)
                    kvColor = 'lime';
                else if (temperatureAbs < 0.6)
                    kvColor = 'yellow';
                else
                    kvColor = 'red';
                _this.game.debug.geom(kvRect, kvColor, true);
                _this.game.debug.geom(kelvins, '#cccccc', false);
            }
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
            if (body && body.key && body.key === 'planet') {
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
            _this.temperament = Math.min(Math.max(_this.temperament * 0.999, 0.1), 20);
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
