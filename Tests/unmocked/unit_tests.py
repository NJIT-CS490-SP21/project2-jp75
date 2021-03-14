import app
import unittest


""" Testing to see if function of reset receives array and resets"""
class TestReset(unittest.TestCase):
    def test_Reset(self):
        data = ["X", "X", "X", None , "O", "O", None ,None ,None ]
        result = app.reset(data)
        #print(result)
        self.assertIs(result, 'Reset')
    def test_Reset1(self):
        data = ["X", "X", None, "O" , "O", "O", "X" ,None ,None ]
        result = app.reset(data)
        #print(result)
        self.assertIsNot(result, '')
    def test_Reset2(self):
        data = ["X", "X", None, "X" , "O", "O", "X" ,None ,None ]
        result = app.reset(data)
        #print(result)
        self.assertIs(result, 'Reset')

""" Testing if function draw receives """
class TestDraw(unittest.TestCase):
    def test_Draw(self):
        data = { 'Draw': 'draw', 'score': 0 }
        result = app.draw(data)
        print(result)
        print(result['score'])
        self.assertEquals(result['score'], 0)
    def test_Draw1(self):
        data = { 'Draw': 'draw', 'score': 1 }
        result = app.draw(data)
        print(result)
        print(result['score'])
        self.assertNotEquals(result['score'], 0)
    def test_Draw2(self):
        data = { 'Draw': 'draw', 'score': 0 }
        result = app.draw(data)
        print(result)
        print(result['score'])
        self.assertTrue(result['Draw'], 'draw')
        
"""Tests to see if we receive """    
class TestWinner(unittest.TestCase):
    def test_Winner(self):
        data = {'winner':'a', 'loser':'b'}
        result = app.winner(data)
        print(result)
        self.assertTrue(result, (data['winner']))
    def test_Winner1(self):
        data = {'winner':'Joe', 'loser':'admin'}
        result = app.winner(data)
        print(result)
        self.assertNotIn(result, data['loser'])
    def test_winner2(self):
        data = {'winner':'a', 'loser':'b'}
        #needs to have name in the database already or will return none
        result = app.winner(data)
        print(result)
        self.assertIn(result, data['winner'])
        
if __name__ == '__main__':
    unittest.main()