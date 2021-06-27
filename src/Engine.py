import chess
import chess.engine


class Engine:
    def __init__(self, engine_path):
        transport, engine = await chess.engine.popen_uci(engine_path)

        self.transport = transport
        self.engine = engine

    def analyze(self, board, limit: chess.engine.Limit):
        return await self.engine.analyse(board, limit)
