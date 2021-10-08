class Logger:
    def __init__(self, name):
        self.name = name

    def log(self, string):
        print(f'[{self.name:>7}]: {string}')