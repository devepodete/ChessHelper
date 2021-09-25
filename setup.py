from pathlib import Path

current_platform = ''

engines = {
    'Stockfish': 'https://stockfishchess.org/',
    'Komodo': 'https://komodochess.com/downloads.htm',
}

directories = [
    'bin/engine'
]


def create_directory(path):
    Path(path).mkdir(parents=True, exist_ok=True)


def announce(begin_msg=None, end_msg=None):
    def real_wrap(function):
        def wrapper(*args, **kwargs):
            if begin_msg is not None:
                print(begin_msg)
            function(*args, **kwargs)
            if end_msg is not None:
                print(end_msg)
                print('=' * 10, '\n')

        return wrapper

    return real_wrap


@announce(begin_msg='Creating directories', end_msg='Directories created')
def create_directories(dirs):
    for path in dirs:
        print(path, end='...')
        create_directory(path)
        print(' OK')


@announce(begin_msg='Setup begin', end_msg='Setup end')
def setup():
    create_directories(directories)

    print('Download chess engine which you want to use.')
    print('Rename it to `engine.exe` and place to `bin/engine`')
    for engine, url in engines.items():
        print(engine, '-', url)
    print()


setup()
