import asyncio
import chess
import chess.engine
from selenium import webdriver

driver = webdriver.Chrome()
driver.get("https://2ip.ru/")
print(driver.page_source)

driver.close()