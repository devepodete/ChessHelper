import chess
import chess.engine

from chess_parser import ChessDataParser
from coin_flipper import flip_coin
from logger import Logger
from strategy import *


class MoveType:
    Best = 'Best'
    Blunder = 'Blunder'
    Error = 'Error'


class MoveWithType:
    def __init__(self, move, move_type: str):
        self.move = str(move.move)
        self.move_type = move_type

class ChessBot:
    def __init__(self, engine_path):
        self.logger = Logger('chess')

        self.board = chess.Board()
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.logger.log(f'engine loaded from {engine_path}')

        self.moves = []
        self.strategy = Strategies.LikeFM

    def process_data(self, data) -> list:
        self.reset_board()
        
        receivedStrategy = ChessDataParser.get_strategy(data)
        if receivedStrategy is not None:
            self.strategy = receivedStrategy
        
        receivedMoves = ChessDataParser.get_move_list(data)
        self.make_moves(receivedMoves)

        moveWithType = self.get_next_move()
        
        if moveWithType.move == 'None':
            self.reset_board()
            return None

        score = self.analyze()
        return [moveWithType.move, moveWithType.move_type, score]

    def reset_board(self):
        self.board = chess.Board()

    def make_move(self, move):
        m = self.board.push_san(move)
        self.moves.append(move)

    def make_moves(self, moves: list):
        for move in moves:
            self.make_move(move)

    def get_next_move(self) -> MoveWithType:
        move = MoveWithType(self.get_best_move(), MoveType.Best)
        
        if flip_coin(self.strategy.blunder_chance):
            move = MoveWithType(self.get_blunder_move(), MoveType.Blunder)
            
        if flip_coin(self.strategy.error_chance):
            move = MoveWithType(self.get_error_move(), MoveType.Error)
        
        return move

    def get_best_move(self) -> str:
        return self.engine.play(self.board, self.strategy.convert_to_limit())

    def get_blunder_move(self) -> str:
        pass
        
    def get_error_move(self) -> str:
        pass

    def analyze(self) -> str:
        info = self.engine.analyse(self.board, chess.engine.Limit(time=0.1))
        return 'score: ' + str(info['score'].white())

    def print_moves(self):
        print(self.moves)