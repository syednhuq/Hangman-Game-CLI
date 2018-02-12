var Letter = require('./letter.js');

function Word(wrd) {
  var that = this;
  this.word = wrd;
  this.letters = [];
  this.wordFound = false;

  this.getLets = function() {
    for(var i = 0; i<that.word.length; i++){
      var newLetter = new Letter(that.word[i]);
      this.letters.push(newLetter);
    }
  };

  this.findingTheWord = function() {
    if(this.letters.every(function(lttr){
      return lttr.appear === true;
    })){
      this.wordFound = true;
      return true;
    }

  };

  this.wasLetterFound = function(guessedLetter) {
    var letterToSend = 0;
    this.letters.forEach(function(lttr){
      if(lttr.letter === guessedLetter){
        lttr.appear = true;
        letterToSend++;
      }
    })
    return letterToSend;
  };

  this.renderTheWord = function() {
    var display = '';
   that.letters.forEach(function(lttr){
      var currentLetter = lttr.letterRender();
      display+= currentLetter;
    });

    return display;
  };
}

module.exports = Word;