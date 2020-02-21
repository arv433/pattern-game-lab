const baseSequenceLength = 3

function startRound (round) {
  let goalSequence = []
  for (let i = 0; i < baseSequenceLength + round; i++) {
    goalSequence.push(generateRandomGridIndex())
  }

  $('[name=round-number]').text(`Round ${round + 1}`)

  // At the very start of the round, create the random sequence that the player is supposed to guess
  function generateRandomGridIndex () {
    return [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]
  }

  function showHideAllTiles () {
    let index = 0
    function showHideTile () {
      const tileCoordinates = goalSequence[index]
      const lastTileCoordinates = goalSequence[index - 1]
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
      if (goalSequence[index + 1]) {
        setTimeout(() => {
          index++
          showHideTile()
        }, 2000)
      } else {
        index = 0
        setTimeout(() => {
          bindClickHandlers()
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

  function bindClickHandlers () {
    $('[name=instructions-dialog').text(
      'Click the tiles in the order that they appeared'
    )
    $(
      `.tile[name=tile-${goalSequence[goalSequence.length - 1][0]}${
        goalSequence[goalSequence.length - 1][1]
      }]`
    ).css('display', 'none')
    $('div.grid-item').addClass('clickable-grid-item')

    let index = 0
    $('div.grid-item').click(function () {
      const clickedTileCoordinates = $(this)
        .find('.tile')
        .attr('name')
        .substring(5)
        .split('')
        .map(character => parseInt(character))
      if (
        clickedTileCoordinates[0] === goalSequence[index][0] &&
        clickedTileCoordinates[1] === goalSequence[index][1]
      ) {
        console.log('Clicked on correct tile')
        if (!goalSequence[++index]) {
          console.log("Not another item in queye")
          startRound(round + 1)
        }
      } else {
        console.log('Clicked on wrong tile')
        $('[name=instructions-dialog').text('You lost!')
        $('div.grid-item').off('click').removeClass('clickable-grid-item')
        setTimeout(() => {
          startRound(0)
        }, 3000);
      }
    })
  }

  console.log(goalSequence)
  // Show, then hide the tiles that are supposed to be memorized and clicked on
  showHideAllTiles()
}

startRound(0)
