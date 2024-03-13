# ChessHub

## Random Notes

Need to implement some form of caching in the game explorer parsing

- Large numbers of games are really going to drag down the performance of this component

## API Calls

### Chess.com

https://www.chess.com/news/view/published-data-api#pubapi-endpoint-player-stats
https://api.chess.com/pub/player/shadogi/stats

https://api.chess.com/pub/player/shadogi/games/archives

### Lichess.org

https://lichess.org/api/user/hammonjj
https://lichess.org/api/user/hammonjj/activity
https://lichess.org/api/games/user/hammonjj
https://lichess.org/api/games/user/hammonjj?sort=dateDesc

- since=<epochtime>

https://lichess.org/api#tag/Games/operation/apiGamesUser

https://chess.wintrcat.uk/
https://github.com/WintrCat/freechess/tree/master

### Stockfish Messages:

Message to Post:
setoption name MultiPV value 3: Generate up to 3 best moves/variations.

position [fen | startpos] moves [movelist]: Sets the current position.

- position startpos: Sets the board to the starting position.
- position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1: Sets the board to a specific position using the FEN notation.
- After specifying the position, you can append a series of moves to reach the current position from the given starting point.

go depth [depth]: Starts the analysis to a specific depth.

- Example: go depth 20 tells Stockfish to analyze the position down to 20 ply (half-moves).
  go movetime [time]: Analyzes the position for a given amount of time in milliseconds.

## Random Useful Links

https://syzygy-tables.info/
https://github.com/lichess-org/mobile/tree/main
https://github.com/lichess-org/chess-openings
https://github.com/lichess-org/lila-tablebase
https://lichess.org/api#tag/Analysis
https://github.com/alan2207/bulletproof-react?tab=readme-ov-file
https://www.material-react-table.com/
https://github.com/bvaughn/react-error-boundary

## Game Phases

Should I investigate using a cloud function to parse/analyze the games to get these stats consistently?

### Middlegame

Starts when:

- There are 10 or fewer major or minors OR
- The back rank is sparse OR
- The white and black pieces are sufficiently mixed on the board
- This can likely be part of the back rank is sparse

### Endgame

Late game starts when there are 6 or fewer major or minor pieces

https://github.com/lichess-org/scalachess/blob/master/src/main/scala/Divider.scala
