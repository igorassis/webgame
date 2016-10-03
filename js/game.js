//Tamanho da tela
var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

//carregando o Assets
var graphicAssets = {
    ship:{URL:'assets/ship.png', name:'ship'},
    bullet:{URL:'assets/bullet.png', name:'bullet'},    
    
    asteroidLarge:{URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
    asteroidMedium:{URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
    asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
};

var shipProperties ={
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    acceleration: 300,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 200,
};

var bulletProperties = {
  speed: 400,
    interval: 250,
    lifespan: 2000,
    maxCount: 30,
};

var gameState = function(game){
    this.shipSprite;
    
    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;
    
    this.bulletGroup;
    this.bulletInterval = 0;
};

//Estados do Jogo
gameState.prototype = {
    //Pré-carrega os conteudos externos(Sons, Imagens, etc.).
    preload: function () {
        game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
        game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
        game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
        
        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
        
    },
    //Inseri as funções no jogo.  
    create: function () {
        this.initGraphics();
        this.initPhysics();
        this.initKeyboard();
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
    },
    //Cria nave.
    initGraphics: function () {
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5);
        
        this.bulletGroup = game.add.group();
    },
    
    initPhysics: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
    },
    
    initKeyboard: function(){
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);  
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    },
    
    checkPlayerInput: function(){
        if(this.key_left.isDown){
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        }else if(this.key_right.isDown){
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        }else{
            this.shipSprite.body.angularVelocity = 0;
        }
        
        if(this.key_thrust.isDown){
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
        }else{
            this.shipSprite.body.acceleration.set(0);
        }
    },
    
    checkBoundaries: function(sprite){
        if(sprite.x < 0){
            sprite.x = game.width;
        }else if(sprite.x > game.width){
            sprite.x = 0;
        }
        if(sprite.y < 0){
            sprite.y = game.height;
        }else if(sprite.y > game.height){
            sprite.y = 0;
        }
    },
};

//Inicia o Jogo com os parametros definidos no inicio do JS.
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);