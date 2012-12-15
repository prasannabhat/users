class Animal
  constructor: (@name) ->

  move: (meters) ->
    alert @name + " moved #{meters}m."

class Snake extends Animal
	constructor: (@name) ->
		@type = "snake"
		super @name

  move: ->
    alert "Slithering..."
    super 5

sam = new Snake "Sammy the Python"

sam.move()
