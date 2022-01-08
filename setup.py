from pathlib import Path
import subprocess

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


@announce('Collecting required packages', 'Required packages collected')
def load_pip():
    subprocess.run(['pip3', 'install', '-r', 'requirements.txt'])


@announce('Creating directories', 'Directories created')
def create_directories(dirs):
    for path in dirs:
        print(path, end='...')
        create_directory(path)
        print(' OK')


@announce('Setup begin', 'Setup end')
def setup():
    load_pip()
    create_directories(directories)

    print('Download chess engine which you want to use.')
    print('Rename it to `engine.exe` and place to `bin/engine`')
    for engine, url in engines.items():
        print(engine, '-', url)
    print()


if __name__ == '__main__':
    setup()
