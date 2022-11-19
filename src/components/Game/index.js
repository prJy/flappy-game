import styled from "styled-components";

export const Character = styled.div`
  position: absolute;
  background: url("/chars/${props=> props.selectedChar}.png") center center no-repeat;
  background-size: contain;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
`;

export const GameContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const GameBoard = styled.div`  
  width: ${props => props.width}px;
  height: 696px;
  background: url("/game-background.jpg") repeat-x left top;
  overflow: hidden;
`;

export const GameControls = styled.div`
  display: ${props => props.isVisible ? 'flex' : 'none' };
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const ControlButton = styled.button`
  color: black;
  font-family: Helvetica, sans-serif;
  font-weight: bold;
  font-size: 26px;
  text-align: center;
  text-decoration: none;
  background-color: #f80;
  display: ${props => props?.isHidden ? 'none' : 'block' };
  position: relative;
  padding: 10px 20px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  text-shadow: 0px 1px 0px #000;
  filter: dropshadow(color=#000, offx=0px, offy=1px);
  -webkit-box-shadow: inset 0 1px 0 #FFE5C4, 0 5px 0 #915100;
  -moz-box-shadow: inset 0 1px 0 #FFE5C4, 0 5px 0 #915100;
  box-shadow: inset 0 1px 0 #FFE5C4, 0 5px 0 #915100;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  margin-bottom: 15px;
  min-width:185px;

  &:hover {
    cursor: pointer;
  }

  :active {
    top:10px;
    background-color:#F78900;
    
    -webkit-box-shadow: inset 0 1px 0 #FFE5C4, inset 0 -3px 0 #915100;
    -moz-box-shadow: inset 0 1px 0 #FFE5C4, inset 0 -3pxpx 0 #915100;
    box-shadow: inset 0 1px 0 #FFE5C4, inset 0 -3px 0 #915100;
  }

  :after {
    content:"";
    height: 100%;
    width: 100%;
    padding: 4px;
    position: absolute;
    bottom: -15px;
    left: -4px;
    z-index: -1;
    background-color: #2B1800;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
`;

export const ScoreBoard = styled.div`
  position: absolute;
  left: 75%;
  color: white;
  font-size: 60px;
  font-weight: bold;
  width: 50px;
`;

export const Asteroid = styled.div`
  display: ${props => props?.isHidden ? 'none' : 'block' };
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  background: red;
  position: relative;  
`;