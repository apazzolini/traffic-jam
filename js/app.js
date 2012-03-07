var TRAFFIC = function($) { 

	// Init
	var numPlayers;

	function init(numPlayers) {
		this.numPlayers = numPlayers;

		if ($('#btn' + numPlayers).hasClass('disabled')) {
			return;
		}

		$('#controlsContainer').children('div.btn-group').children('a.btn').removeClass('btn-inverse').removeClass('disabled');
		$('#btn' + numPlayers).addClass('btn-inverse').addClass('disabled');

		$('#spacesContainer').html("");
		$('#movesContainer').html("");

		generateSpaces(numPlayers + 1);
	}

	function generateSpaces(numSpaces) {
		var playersPerSide = Math.floor(numSpaces / 2);
		var initialEmptySpace = playersPerSide + 1;

		for (var i = 1; i <= numSpaces; i++) {
			var space = $('<div class="well space">&nbsp;</div>');
			space.attr('id', 'space' + i);

			if (i < initialEmptySpace) { 
				generatePlayer(space, playersPerSide - i + 1, 'r');
			} else if (i > initialEmptySpace) {
				generatePlayer(space, i - playersPerSide - 1, 'l');
			}

			space.click(function() {
				move($(this).children(':first').attr('id'));
			});

			$('#spacesContainer').append(space);
		}
	}

	function generatePlayer(space, i, side) {
		var player = $('<div class="player"></div>');
		player.attr('id', side + i);
		if (side == 'r') { 
			player.append('<i class="icon-arrow-right"></i>');
		} else { 
			player.append('<i class="icon-arrow-left"></i>');
		}
		space.html(player);
	}

	// Private

	function getSpot(personId) {
		return $('#' + personId).parent();
	}

	function getPersonInSpace(space) {
		return space.children(":first");
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
		return getNextSpot(personId).attr('id') != undefined && getNextSpot(personId).children().html() == null;
	}

	function moveForward(personId) {
		var $oldSpot = getSpot(personId);
		getNextSpot(personId).html(getSpot(personId).html());
		$oldSpot.html("&nbsp;");
	}

	function canJumpPerson(personId) {
		if (isFacingRight(personId)) {
			return getPersonInSpace(getNextSpot(personId)).attr('id').indexOf('r') == -1 && getJumpSpot(personId).children().html() == null;
		} else {
			return getPersonInSpace(getNextSpot(personId)).attr('id').indexOf('l') == -1 && getJumpSpot(personId).children().html() == null;
		}
	}

	function jumpPerson(personId) {
		var $oldSpot = getSpot(personId);
		getJumpSpot(personId).html(getSpot(personId).html());
		$oldSpot.html("&nbsp;");
	}


	// Public

	function reset() {
		$('#spacesContainer').html("");
		$('#movesContainer').html("");
		generateSpaces(this.numPlayers + 1);
	}

	function move(personId) {

		if (canMoveForward(personId)) {
			moveForward(personId);
			$('#movesContainer').append(personId.toUpperCase()).append("&nbsp; &nbsp;");
			return true;
		} else if (canJumpPerson(personId)) {
			jumpPerson(personId);
			$('#movesContainer').append(personId.toUpperCase()).append("&nbsp; &nbsp;");
			return true;
		}

		return false;
	}

	function solve() {
		this.reset();

		var personsPerSide = this.numPlayers / 2;
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
		init: init,
		reset: reset,
		move: move,
		solve: solve
	}
}(jQuery);
