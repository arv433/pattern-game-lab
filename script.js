function startRound (round, baseSequenceLength = 3) {

  $('[name=round-number]').text(`Round ${round + 1}`)
  $('div.grid-item').off('click')
  let goalSequence = getGoalPattern(round, baseSequenceLength)

  // At the very start of the round, create the random sequence that the player is supposed to guess
  function getGoalPattern (round, baseSequenceLength) {
    let goalSequence = []
    for (let i = 0; i < baseSequenceLength + round; i++) {
      goalSequence.push(generateRandomGridIndex())
    }
    return goalSequence
    function generateRandomGridIndex () {
      return [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]
    }
  }

  function showHideAllTiles () {
    let i = 0
    function showHideTile () {
      const tileCoordinates = goalSequence[i]
      const lastTileCoordinates = goalSequence[i - 1]
      $(`.tile[name=tile-${tileCoordinates[0]}${tileCoordinates[1]}]`).css(
        'display',
        'block'
      )
      lastTileCoordinates &&
        JSON.stringify(lastTileCoordinates) !==
          JSON.stringify(tileCoordinates) &&
        $(
          `.tile[name=tile-${lastTileCoordinates[0]}${lastTileCoordinates[1]}]`
        ).css('display', 'none')
      if (goalSequence[i + 1]) {
        setTimeout(() => {
          i++
          showHideTile()
        }, 2000)
      } else {
        i = 0
        setTimeout(() => {
          bindClickHandlers(goalSequence)
        }, 2000)
      }
    }
    $('[name=instructions-dialog').text(
      'Remember the order in which the tiles appear and disappear'
    )
    setTimeout(() => {
      showHideTile()
    }, 1500)
  }

  function bindClickHandlers (goalSequence) {
    console.log('pre', goalSequence)
    $('[name=instructions-dialog').text(
      'Click the tiles in the order that they appeared'
    )
    // Hide the last tile in the pattern
    $(
      `.tile[name=tile-${goalSequence[goalSequence.length - 1][0]}${
        goalSequence[goalSequence.length - 1][1]
      }]`
    ).css('display', 'none')
    $('div.grid-item').addClass('clickable-grid-item')

    let j = 0
    $('div.grid-item').click(function () {
      console.log('post', goalSequence)
      const clickedTileCoordinates = $(this)
        .find('.tile')
        .attr('name')
        .substring(5)
        .split('')
        .map(character => parseInt(character))
      const correct = clickedTileCoordinates[0] === goalSequence[j][0] &&
      clickedTileCoordinates[1] === goalSequence[j][1]
      console.log(correct)
      if (correct) {
        console.log('Clicked on correct tile')
        if (!goalSequence[j + 1]) {
          // Next round
          console.log('Not another item in queue')
          j = 0
          startRound(round + 1)
        } else {
          // Await next click
          j++
        }
      } else {
        // LOSS sequence
        console.log('Clicked on wrong tile')
        $('[name=instructions-dialog').text('You lost!')
        $('div.grid-item')
          .off('click')
          .removeClass('clickable-grid-item')
        setTimeout(() => {
          startRound(0)
        }, 3000)
      }
    })
  }

  console.log(goalSequence)
  // Show, then hide the tiles that are supposed to be memorized and clicked on
  showHideAllTiles()
}

startRound(0)
