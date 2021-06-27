from pathlib import Path

current_platform = ''
web_drivers = {
    'Chrome': 'https://sites.google.com/chromium.org/driver/',
    'Firefox': 'https://github.com/mozilla/geckodriver/releases/',
}

directories = [
    '../bin/driver',
    '../engine'
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


def setup_platform():
    from sys import platform
    global current_platform

    if platform.startswith('linux'):
        current_platform = 'Linux'
    elif platform.startswith('win'):
        current_platform = 'Windows'
    else:
        raise OSError('Unsupported OS: ' + platform)


@announce(begin_msg='Setup begin', end_msg='Setup end')
def setup():
    create_directories(directories)
    setup_platform()

    print('Download web driver for browser which you want to use and place it in `bin/driver/` folder')
    for browser, url in web_drivers.items():
        print(browser, '-', url)


setup()
