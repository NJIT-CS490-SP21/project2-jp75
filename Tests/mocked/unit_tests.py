import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))

from app import add_user
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'Test',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Test'],
            },
            
        ]
        
        inial_joined = models.Joined(username=INITIAL_USERNAME)
        self.initial_db_mock = [inial_joined]
        
        initial_filter = models.Joined.query.filter_by(username=INITIAL_USERNAME)
        self.initial_db_filter = [initial_filter]
     
    def mocked_db_session_add(self, username):
         self.initial_db_mock.append(username)
     
     
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
        
    def mocked_person_query_filter(self):
        return self.initial_db_filter
    
    def test_success(self):
        for test in self.success_test_params:
            
            with patch('models.Joined.query.filter_by') as filter_mock:
                filter_mock.first = self.mocked_person_query_filter
                with patch('app.DB.session.add', self.mocked_db_session_add):
                    with patch('app.DB.session.commit', self.mocked_db_session_commit):
                        with patch('models.Joined.query') as mocked_query:
                            mocked_query.all = self.mocked_person_query_all
                        
                            print(self.initial_db_mock)
                            actual_result = add_user(test[KEY_INPUT])
                            print(actual_result)
                            expected_result = test[KEY_EXPECTED]
                            print(self.initial_db_mock)
                            print(expected_result)
                        
                            self.assertEqual(len(actual_result),len(expected_result))
                            self.assertEqual(actual_result,expected_result[1])
            
            
if __name__ == '__main__':
    unittest.main()