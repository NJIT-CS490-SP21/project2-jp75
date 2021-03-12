import React from 'react';

export function Tboard(props) {
  return <div> {props.letter} </div>;
}
export function User(props) {
  return <div> {props.name}</div>;
}

export function LoginButton(props) {
  return <button onClick={props.onClick}>Login</button>;
}
