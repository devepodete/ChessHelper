import subprocess


def main():
    engine_path = 'bin/engine/engine.exe'
    subprocess.run(['python', 'src/ChessBot/main.py', engine_path])


if __name__ == '__main__':
    main()
