from worker import Worker

import os
import sys


def main():
    if len(sys.argv) != 2:
        print(f'Wrong arguments. Usage: python {sys.argv[0]} path_to_engine')
        exit(1)

    workingPort = 9092
    enginePath = sys.argv[1]

    worker = Worker(workingPort, enginePath)
    worker.run()


if __name__ == '__main__':
    main()
