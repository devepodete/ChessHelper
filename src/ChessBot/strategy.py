from chess.engine import Limit


class Strategy:
    def __init__(self, depth=10, time_per_move=0.1, blunder_chance=0.05, error_chance=0.1):
        self.depth = depth
        self.time_per_move = time_per_move
        self.blunder_chance = blunder_chance
        self.error_chance = error_chance

    def convert_to_limit(self) -> Limit:
        return Limit(depth=self.depth, time=self.time_per_move)


class Strategies:
    EasyBan = Strategy(depth=10, time_per_move=0.1, blunder_chance=0, error_chance=0)
    LikeGM = Strategy(depth=7, time_per_move=0.1, blunder_chance=0.01, error_chance=0.01)
    LikeFM = Strategy(depth=6, time_per_move=0.1, blunder_chance=0.02, error_chance=0.05)
    Human = Strategy(depth=5, time_per_move=0.1, blunder_chance=0.05, error_chance=0.1)
    Newbee = Strategy(depth=5, time_per_move=0.1, blunder_chance=0.25, error_chance=0.5)
