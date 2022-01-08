from random import random


def flip_coin(win_chance: float) -> bool:
    return random() < win_chance
