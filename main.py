import asyncio
from selenium import webdriver

driver_folder = 'bin/driver/'
driver_suffix = '_driver.exe'


def open_driver(name: str):
    if name.startswith('chrome'):
        return webdriver.Chrome(driver_folder + 'chrome' + driver_suffix)
    elif name.startswith('firefox'):
        return webdriver.Chrome(driver_folder + 'firefox' + driver_suffix)


def main():
    driver = open_driver('chrome')
    driver.get("https://2ip.ru/")



    driver.close()


if __name__ == '__main__':
    main()
