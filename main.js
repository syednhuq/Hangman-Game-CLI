//require npm inquirer and is-letter
//is-letter checks if it is a one character letter 
var inquirer = require('inquirer');
var isLetter = require('is-letter');

//require objects/exports
var Word = require('./word.js');
var Game = require('./game.js');


//hangman corpse
var hangManDisplay = Game.newWord.hangman; 

//set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
  //bring in the avenger name from game.js
  avenger: Game.newWord.avenger,
  lettersLeft: 10,
  //empty array to hold letters guessed and check to see if letter was already guessed by player
  lettersLost: [],
  
  display: 0,
  currentWord: null,

  //_____asks player if they would like to play_____
  startGame: function() {
    var that = this;
    //clears lettersLost before a new game starts if it's not already empty.
    if(this.lettersLost.length > 0){
      this.lettersLost = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Oh no! Random Guy is about to get vaporized by Loki! Call forth an Avenger?"
    }])

    .then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("Oh my... someone took the heartless pill...");
      }
    })},

  //_____starts a new game if they want to play_____
  newGame: function() {
    if(this.lettersLeft === 10) {
      console.log("Alright, hurry now! Call their name!");
      console.log('*****************');
      //generates random number based on the avenger
      var randNum = Math.floor(Math.random()*this.avenger.length);
      this.currentWord = new Word(this.avenger[randNum]);
      this.currentWord.getLets();
      //displays current word as blanks.
      console.log(this.currentWord.renderTheWord());
      this.rePromptPlayer();
    } else{
      this.resetlettersLeft();
      this.newGame();
    }
  },

  resetlettersLeft: function() {
    this.lettersLeft = 10;
  },

  //____PROMPT Player for letter____
  rePromptPlayer : function(){
    var that = this;
    //asks player for a letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Type a letter to write the name of the Avenger:",
      //Use the npm is-letter here to validate the character 
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      // using toUpperCase becuase all the words I used in my bank are in CAPS 
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      //adds to the lettersLost array 
      var guessedAlready = false;
        for(var i = 0; i<that.lettersLost.length; i++){
          if(letterReturned === that.lettersLost[i]){
            guessedAlready = true;
          }
        }
        //if the letter wasn't guessed already run through entire function, else reprompt player
        if(guessedAlready === false){
          that.lettersLost.push(letterReturned);

          var found = that.currentWord.wasLetterFound(letterReturned);
          //if letter not found tell player they were wrong
          if(found === 0){
            console.log('Oh no, that letter is not part of their name! Hurry time is ticking!');
            that.lettersLeft--;
            that.display++;

            //let player know # of guesses remaining 
            console.log('Letters remaining: ' + that.lettersLeft);
            console.log(hangManDisplay[(that.display)-1]);

            console.log('\n*******************');
            console.log(that.currentWord.renderTheWord());
            console.log('\n*******************');
            console.log("Letters used: " + that.lettersLost);

          } else{
            console.log('Woooh! Your doing good! Keep it up!');
              //checks to see if player has won
              if(that.currentWord.findingTheWord() === true){
                console.log(that.currentWord.renderTheWord());
                console.log('You saved Random Guy! Yayy!');
                console.log('Yay! You did it! ' + that.currentWord.word + ' has saved the day!');
      
              } else{
                // display the player how many guesses remaining
                console.log('Letters remaining: ' + that.lettersLeft);
                console.log(that.currentWord.renderTheWord());
                console.log('\n*******************');
                console.log("Letters used: " + that.lettersLost);

              }
          }
          if(that.lettersLeft > 0 && that.currentWord.wordFound === false) {
            that.rePromptPlayer();
          }else if(that.lettersLeft === 0){
            console.log('Oh bloody, you took too long. Well no worries, he was just an NPC anyway XD');
          }
        } else{
            console.log("You already tried that letter! You have short term memory loss or something?")
            that.rePromptPlayer();
          }
    });
  }
}

hangman.startGame();