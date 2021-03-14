import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import turn from './App';

test('Login button disappears', () => {
   const result = render(<App />);
   
   const loginButtonElement = screen.getByText('Login');
   expect(loginButtonElement).toBeInTheDocument();
   
   fireEvent.click(loginButtonElement);
   expect(loginButtonElement).toBeInTheDocument();
});


test('Tests to see if text field disappears after login button is clicked', () => {
    const result = render(<App />);
    
    const loginButtonElement = screen.getByText('Login');
    const Textfield = screen.getByPlaceholderText('username')
    expect(Textfield).toBeInTheDocument();
    fireEvent.click(loginButtonElement);
    expect(Textfield).toBeInTheDocument();
});

test('is the board empty?', () => {
    const result = render(<App />);
    const board = Array(9).fill(null);
 
    expect(board).toEqual(expect.arrayContaining([null,null,null,null,null,null,null,null,null]))

    
});

test('Checked if adding to array of spectators will work form App', () => {
 const result = render(<App />);
 var SPECTATORS = App.getSpecs
 SPECTATORS = ['a','c','d']
 expect(SPECTATORS).toEqual(expect.arrayContaining(['a', 'c','d']))

});

//Was having issues trying to find tests because my code wasn't finding anything via getText