from strategy import Strategy


class ChessDataParser:
    @staticmethod
    def get_strategy(string) -> Strategy:
        pass

    @staticmethod
    def get_move_list(string):
        s = string.replace('\r', '').split('\n')
        num = int(s[-1])
        return s[-num - 1:-1]
