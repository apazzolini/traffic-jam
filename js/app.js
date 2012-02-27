var TRAFFIC = function($) { 

  // Init

  $('.space').live('click', function() {
    move($(this).children(':first').attr('id'));
  });

  // Private

  function getSpot(personId) {
    return $('#' + personId).parent();
  }

  function isFacingRight(personId) { 
    return personId.indexOf('r') != -1;
  }

  function getNextSpot(personId) {
    if (isFacingRight(personId)) {
      return getSpot(personId).next();
    } else {
      return getSpot(personId).prev();
    }
  }

  function getJumpSpot(personId) {
    if (isFacingRight(personId)) {
      return getSpot(personId).next().next();
    } else {
      return getSpot(personId).prev().prev();
    }
  }

  function canMoveForward(personId) {
    return getNextSpot(personId).children().html() == null;
  }

  function moveForward(personId) {
    var $oldSpot = getSpot(personId);
    getNextSpot(personId).html(getSpot(personId).html());
    $oldSpot.html("");
  }

  function canJumpPerson(personId) {
      return getJumpSpot(personId).children().html() == null;
  }

  function jumpPerson(personId) {
    var $oldSpot = getSpot(personId);
    getJumpSpot(personId).html(getSpot(personId).html());
    $oldSpot.html("");
  }


  // Public

  function move(personId) {
    $('#moves').append(personId.toUpperCase()).append(getSpot(personId).attr('id')).append("<br/>");

    if (canMoveForward(personId)) {
      moveForward(personId);
      return true;
    } else if (canJumpPerson(personId)) {
      jumpPerson(personId);
      return true;
    }

    return false;
  }

  function solve() {

    var personsPerSide = 4;
    var spaces = personsPerSide * 2 + 1;

    var movesPerPass = 1;
    var fullPasses = 0;

    var currentDirection = -1;
    var currentSpace = personsPerSide + 1;

    for (var i = 0; i < spaces; i++) {
      var successfulMoves = 0;
      while (successfulMoves < movesPerPass) {
        currentSpace += currentDirection;

        var personId = $("#space" + currentSpace).children(":first").attr('id');
        if (personId == null) {
          continue;
        }

        if ((currentDirection < 0 && isFacingRight(personId)) ||
            (currentDirection > 0 && !isFacingRight(personId))) {
          var success = move(personId);
          if (success) {
            successfulMoves++;
          }
        }
      }

      if (movesPerPass == personsPerSide) {
        fullPasses++;
      }

      if (fullPasses == 0) {
        movesPerPass++;
      } else if (fullPasses > 2) {
        movesPerPass--;
      }

      currentDirection *= -1;
    }
  }

  return {
    move: move,
    solve: solve
  }
}(jQuery);
