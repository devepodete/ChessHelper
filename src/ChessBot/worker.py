import socket

from strategy import *
from logger import Logger
from chessbot import ChessBot


class Worker:
    def __init__(self, port: int, engine_path: str):
        self.port = port
        self.sock = socket.socket()
        self.logger = Logger('socket')
        self.chessBot = ChessBot(engine_path)
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

            response = self.chessBot.process_data(data)
            if response is None:
                continue
            
            self.logger.log('sending response...')
            self.sendResponse(conn, ' '.join(response))
            self.logger.log('OK')