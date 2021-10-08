from worker import Worker

def main():
    workingPort = 9092
    enginePath = '../../bin/engine/engine.exe'

    worker = Worker(workingPort, enginePath)
    worker.run()
    
    #worker.sock.close()
    #worker.chessBot.engine.quit()

    
if __name__ == '__main__':
    main()
