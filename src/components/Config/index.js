import styled from "styled-components";

export const ConfigContainer = styled.div`
  display: ${props => props.isVisible ? 'flex' : 'none' };
  flex-direction: column;
  width: 350px;
  background: #d7b6b6;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  border: 3px solid #000;
  opacity: 0.9;
`

export const ConfigHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px dashed  #000;
  height: 50px;
`;

export const ConfigTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  width: 100%;
`

export const ConfigExitButton = styled.button`
  overflow: hidden;
  position: relative;
  border: none;
  padding: 0;
  width: 2em; height: 2em;
  border-radius: 50%;
  background: transparent;
  color: #000;
  font: inherit;
  text-indent: 100%;
  cursor: pointer;

  &:focus {
    outline: solid 0 transparent;
    box-shadow: 0 0 0 2px #000
  }

  &:hover {
    background: rgba(29, 161, 142, .1)
  }

  &:before, &:after {
    position: absolute;
    top: 15%; left: calc(50% - .0625em);
    width: .125em; height: 70%;
    border-radius: .125em;
    transform: rotate(45deg);
    background: currentcolor;
    content: ''
  }

  &:after { transform: rotate(-45deg); }
  margin-left: auto;
`;

export const ConfigControls = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
`
export const FlagPicker = styled.div `
  margin-left: auto;
`;

export const SkinPicker = styled.div `
  display: 'block';
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;