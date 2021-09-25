import socket
import chess
import chess.engine


class Logger:
    def __init__(self, name):
        self.name = name

    def log(self, string):
        print(f'[{self.name:>7}]: {string}')


class ChessHelper:
    def __init__(self, engine_path):
        self.logger = Logger('chess')

        self.board = chess.Board()
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.logger.log(f'engine loaded from {engine_path}')

        self.moves = []

    def resetBoard(self):
        self.board = chess.Board()

    def makeMove(self, move):
        m = self.board.push_san(move)
        self.moves.append(move)
        self.logger.log(f'made move {m}')

    def getNextBestMove(self) -> str:
        best_move = self.engine.play(self.board, chess.engine.Limit(time=0.1))
        return str(best_move.move)

    def analyze(self) -> str:
        info = self.engine.analyse(self.board, chess.engine.Limit(time=0.1))
        return 'score: ' + str(info['score'].white())

    def printMoves(self):
        print(self.moves)

    def __del__(self):
        self.engine.quit()


class Parser:
    @staticmethod
    def parseMove(string):
        return string.replace('\r', '').split('\n')[-1]


class SocketWorker:
    def __init__(self, port: int, chess_helper):
        self.port = port
        self.sock = socket.socket()
        self.logger = Logger('socket')
        self.chessHelper = chess_helper
        self.setup()

    def setup(self):
        self.logger.log('setting up socket worker...')
        self.sock.bind(('', self.port))
        self.logger.log(f'working port is {self.port}')
        self.sock.listen(1)

    @staticmethod
    def sendResponse(conn, text):
        conn.send(str.encode("HTTP/1.1 200 OK\n"
                             f"Content-Length: {len(text)}\n"
                             "Content-Type: text/plain;charset=UTF-8\n"
                             "\n"
                             f"{text}"))

    def run(self):
        self.logger.log('accepting socket...')
        conn, addr = self.sock.accept()
        self.logger.log(f'socket accepted, address={addr}')

        while True:
            self.logger.log('receiving data...')

            data = conn.recv(4096).decode()
            if not data:
                self.logger.log('no more data from socket. Exiting...')
                break

            receivedMove = Parser.parseMove(data)
            self.logger.log(f'got data: {receivedMove}')

            self.chessHelper.makeMove(receivedMove)
            bestMove = self.chessHelper.getNextBestMove()

            if bestMove == 'None':
                self.chessHelper.resetBoard()
                continue

            score = self.chessHelper.analyze()

            self.logger.log('sending response...')
            self.sendResponse(conn, ' '.join([bestMove, score]))
            self.logger.log('OK')

    def __del__(self):
        self.sock.close()


workingPort = 9090
enginePath = '../engine/engine.exe'

sw = SocketWorker(workingPort, ChessHelper(enginePath))
sw.run()
