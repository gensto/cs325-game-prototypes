"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/sprites/phaser.png' );
        game.load.image('player1', 'assets/sprites/player1.png');
        game.load.image('player2', 'assets/sprites/player2.png');
        game.load.image('player1goal', 'assets/sprites/goal.png');
        game.load.image('player2goal', 'assets/sprites/goal.png');
        game.load.image('ball', 'assets/sprites/ball.png');

        game.load.audio('hitsound', 'assets/sound/hitsound.mp3');
    }

    var player1;
    var player2;

    var ball;

    var player1left;
    var player1right;
    var player1rotateLeft;
    var player1rotateRight;

    var player2left;
    var player2right;
    var player2rotateLeft;
    var player2rotateRight;

    var hitsound;

    var player1Score = 0;
    var player2Score = 0;

    var score1;
    var score2;

    var timerOn;


    function create() {

        hitsound = game.add.audio('hitsound');
        hitsound.volume = 0.3;

        player1left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        player1right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        player1rotateLeft = game.input.keyboard.addKey(Phaser.Keyboard.O);
        player1rotateRight = game.input.keyboard.addKey(Phaser.Keyboard.P);

        player2left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        player2right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        player2rotateLeft = game.input.keyboard.addKey(Phaser.Keyboard.F);
        player2rotateRight = game.input.keyboard.addKey(Phaser.Keyboard.G);

        // Create a sprite at the center of the screen using the 'logo' image.
        player1 = game.add.sprite( game.world.centerX, 50, 'player1' );
        player2 = game.add.sprite( game.world.centerX, 550, 'player2' );


        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        player1.anchor.setTo( 0.5, 0.5 );
        player2.anchor.setTo( 0.5, 0.5 );

        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( player1, Phaser.Physics.ARCADE );
        game.physics.enable( player2, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.

        player1.body.collideWorldBounds = true;
        player2.body.collideWorldBounds = true;

        player1.body.immovable = true;
        player2.body.immovable = true;

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };

        score1 = game.add.text(760, 20, player1Score, style);
        score1.anchor.setTo(0.5, 0.5);

        score2 = game.add.text(760, 580, player2Score, style);
        score2.anchor.setTo(0.5, 0.5);

        game.physics.arcade.checkCollision.bottom = false;
        game.physics.arcade.checkCollision.top = false;

        //bouncy.body.gravity.y = 600;
        ball = game.add.sprite( game.world.centerX, game.world.centerY, 'ball' );
        game.physics.enable( ball, Phaser.Physics.ARCADE );
        ball.scale.setTo(0.1, 0.1);
        ball.anchor.setTo(0.5, 0.5);

        ball.body.collideWorldBounds = true;
        //countDown();
        game.time.events.add(Phaser.Timer.SECOND * 3, spawnBall, this);
    }

    function update() {

        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        ballOnSpriteCollision();
        updateMovement();
        detectScore();


        console.log(player1.angle);
    }

    function countDownToSpawn()
    {
      game.time.events.add(Phaser.Timer.SECOND * 3, spawnBall, this);
    }

    function spawnBall()
    {
      ball.kill();
      ball = game.add.sprite( 200, game.world.centerY, 'ball' );
      game.physics.enable( ball, Phaser.Physics.ARCADE );
      ball.body.collideWorldBounds = true;

      ball.scale.setTo(0.1, 0.1);
      ball.anchor.setTo(0.5, 0.5);

      ball.body.velocity.setTo(400, 400);
      ball.body.bounce.setTo(1, 1);
    }

    function detectScore()
    {
      //if player hit ball last

      if(ball.y <= 15)
      {
        player1Score++;
        score1.setText(player1Score);
        spawnBall();
      }
      if(ball.y >= 585)
      {
        console.log("goal detected lol");
        player2Score++;
        score2.setText(player2Score);
        spawnBall();
      }
    }

    function updateMovement()
    {
      if(player1left.isDown)
      {
        player1.x -= 7;
      }
      if(player1right.isDown)
      {
        player1.x += 7;
      }
      if(player1rotateLeft.isDown && player1.angle > -60)
      {
        console.log("in here");
        player1.angle -= 5;
      }
      if(player1rotateRight.isDown && player1.angle < 60)
      {
        player1.angle += 5;
      }

      if(player2left.isDown)
      {
        player2.x -= 7;
      }
      if(player2right.isDown)
      {
        player2.x += 7;
      }
      if(player2rotateLeft.isDown && player2.angle > -60)
      {
        player2.angle -= 5;
      }
      if(player2rotateRight.isDown && player2.angle < 60)
      {
        player2.angle += 5;
      }
    }

    function ballOnSpriteCollision()
    {

      if(game.physics.arcade.collide(player1, ball))
      {
        hitsound.play();

        if(player1.angle > 0)
        {
          ball.body.velocity.x = Math.abs(ball.body.velocity.x)*-1;
        }
        if(player1.angle < 0)
        {
          ball.body.velocity.x = Math.abs(ball.body.velocity.x);
        }

        ball.body.velocity.y = Math.abs(ball.body.velocity.y);
      }
      if(game.physics.arcade.collide(player2, ball))
      {
        hitsound.play();

        if(player2.angle > 0)
        {
          ball.body.velocity.x = Math.abs(ball.body.velocity.x);
        }
        if(player2.angle < 0)
        {
          ball.body.velocity.x = Math.abs(ball.body.velocity.x)*-1;
        }

        ball.body.velocity.y = Math.abs(ball.body.velocity.y)*-1;
      }
    }
};
