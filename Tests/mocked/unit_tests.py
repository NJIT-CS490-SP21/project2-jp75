""" If this doesn't work drag it out to the level o the app.py file"""

from app import APP, SOCKETIO
import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))

from app import add_user_name
from app import winner
from app import on_connection1,on_disconnect, on_connect
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'Test101',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Test101'],
            },
        ]
        
        inial_joined = models.Joined(username=INITIAL_USERNAME)
        self.initial_db_mock = [inial_joined]
     
    def mocked_db_session_add(self, username):
         self.initial_db_mock.append(username)
     
     
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
        
    def mocked_person_query_filter(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Joined.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
                        
                        print(self.initial_db_mock)
                        actual_result = add_user_name(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result),len(expected_result))
                        self.assertEqual(actual_result[1],expected_result[1])
                        
Winner =  "input"              
    
   
def socketio_test():
    """ Tests the server """
    # log the user in through Flask test client
    flask_test_client = APP.test_client()
    # connect to Socket.IO without being logged in
    socketio_test_client = SOCKETIO.test_client(
        APP, flask_test_client=flask_test_client)
    # makes a connection to the client
    assert socketio_test_client.is_connected()
    #test connect function
    connect = on_connect()
    assert connect == 'connected'
    # logged in test username just a test
    data={ 'joined':'test'}
    #assuming that the user left the server
    #client disconnect
    assert not socketio_test_client.disconnect()
    #test the function
    disconnect = on_disconnect()
    assert disconnect=='disconnected'
    #lets us know that the client actually disconnected
    #assert socketio_test_client.disconnect()
    #print(user)
    
    
def socketio_test1():
    """ Tests to see if server adds users properly """
    # log the user in through Flask test client
    flask_test_client = APP.test_client()
    # connect to Socket.IO without being logged in
    socketio_test_client = SOCKETIO.test_client(
        APP, flask_test_client=flask_test_client)
    # makes a connection to the client
    assert socketio_test_client.is_connected()
    #test data to see if function works
    data={ 'joined':'test'}
    #go through on connection to get your logged in player
    result1 = on_connection1(data)
    #tests adding second player
    data2= {'joined': 'test2'}
    result2 = on_connection1(data2)
    #tests adding spectator
    data3 = {'joined': 'test3'}
    result3 = on_connection1(data3)
    print(result1,result2,result3)
    """we could see that it runs through th function put's test3 as a spectator
    and returns the login list of current added players"""
    assert result1==result2
    assert not result1[0] == result2[1]
    assert not result3[2] == result2[1]
    assert not result3[2] == result1[0]
    #since we receive the return we could see that the function emitted back to the client
    
if __name__ == '__main__':
    unittest.main()
    #socketio_test()
    #socketio_test1()
    #to test all of these effectively you need to keep comments
    