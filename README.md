# ChessHub

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