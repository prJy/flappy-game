import './App.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  GameContainer,
  GameBoard,
  Character,
  GameControls,
  ControlButton,
  ConfigContainer, 
  ConfigHeader,
  ConfigTitle,
  ConfigExitButton,
  ConfigControls,
  FlagPicker,
  SkinPicker,
  Asteroid,
  ScoreBoard
} from './components'

const locales = {
  pt_BR: {
    startGame: "Iniciar Partida",
    settings: "Configurações",
    skin: "Selecione sua skin:",
    language: "Idioma:",
  },
  en: {
    startGame: "Start Game",
    settings: "Settings",
    skin: "Choose your skin:",
    language: "Language:",
  }
}

const availableSkinsNames =["1","1-1", "2", "3", "4",];

const char_Size = 64;
const board_Height = 696;
const board_Width = 720;
const charGravity = 9;
const charImpulse = char_Size * 1.5;
const space_Asteroids = 200;
const asteroid_Width = 40;
const hasCollision = true;
const speed = 5;
const step = 5;

function App() {
  
  const initialConfig = {
    lang: "pt_BR",
  }

  const createNewAsteroid = () =>  {
    // F = ( SCREEN HEIGHT * PERCENT ) - SPACE_BETWEEN_ASTEROIDS
    return Math.floor((Math.random() * board_Height)) - space_Asteroids;   
 }

  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [configs, setConfigs] = useState(initialConfig);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [characterPos, setCharacterPos] = useState((board_Height / 2) - char_Size); 
  const [asteroidHeight, setAsteroidHeight] = useState(createNewAsteroid);
  const [asteroidLeft, setAsteroidLeft] = useState(board_Width - asteroid_Width);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameBoard = useRef(null);

  const bottomAsteroidHeight = board_Height - space_Asteroids - asteroidHeight;
  const bottomAsteroidTop = board_Height - (bottomAsteroidHeight + asteroidHeight);
  const speedMultiplier = Math.floor((score / step)) + 1;

  // CREATE NEW ASTEROID 
  const refreshAsteroidAnimation = useCallback(() => {
    setAsteroidLeft(board_Width - asteroid_Width);
      // F = ( SCREEN HEIGHT * PERCENT ) - SPACE_BETWEEN_ASTEROIDS
      setAsteroidHeight(createNewAsteroid);
  }, [setAsteroidHeight, setAsteroidLeft]);

  // BACKGROUND ANIMATION
  useEffect(() => {
    let backroundAnimationId;
    let position = 0;
    
    if (gameHasStarted) {
      backroundAnimationId = setInterval(() => {
        position -= 5;
        gameBoard.current.style.backgroundPositionX= `${position}px`;
      }, 30);
    }
    
    return () => {
      clearInterval(backroundAnimationId);
    };
  }, [gameHasStarted]);

  // CHARACTER GRAVITY ANIMATION
  useEffect(() =>{
    let gravityAnimation;
   
    if (gameHasStarted && characterPos <= board_Height - (char_Size)) {
      gravityAnimation = setInterval(() => {
        let position = characterPos + charGravity;
        setCharacterPos(position);
      }, 30);
    }
    
    return () => {
      clearInterval(gravityAnimation);
    };
    
  }, [characterPos, gameHasStarted]);
  
  // ASTEROID MOVEMENT
  useEffect(() =>{
    let asteroidAnimation;
   
    if (gameHasStarted && asteroidLeft >= -asteroid_Width) {
      asteroidAnimation = setInterval(() => {        
        let position = asteroidLeft - (speed * speedMultiplier);
        setAsteroidLeft(position);
      }, 30);

      return () => {
        clearInterval(asteroidAnimation);
      };
    } 
    else if (gameHasStarted) {
      refreshAsteroidAnimation();
      let newScore = score +1;
      setScore(newScore);
    }
    
  }, [asteroidHeight, asteroidLeft, gameHasStarted, score, bottomAsteroidHeight, speedMultiplier, refreshAsteroidAnimation]);
 
  // COLLISION DETECTION
  useEffect(()=>{
    if (!hasCollision) return;

    const topCollision = characterPos >= 0 && characterPos < asteroidHeight;
    const bottomCollision = characterPos >= board_Height - bottomAsteroidHeight;

    if ((asteroidLeft >= 0 && asteroidLeft <= asteroid_Width) && (topCollision || bottomCollision)) {
      setGameHasStarted(false);
      setIsGameOver(true);
    }
  }, [characterPos, asteroidHeight, bottomAsteroidHeight, asteroidLeft]);

  useEffect(() => {
    if (isGameOver) {
      refreshAsteroidAnimation();
      setIsGameOver(false);
    }
  }, [asteroidHeight, isGameOver, refreshAsteroidAnimation]);

  const t = (string) => {
    return locales[configs.lang][string];
  };

  const handleGameStart = () => {
    setScore(0);
    setGameHasStarted(true);
    handleCloseSettings();
  };

  const handleOpenSettings = () => {
    setIsConfigOpen(true);
  };

  const handleCloseSettings = () => {
    setIsConfigOpen(false);
  };
  
  const handleCharacterFlying = () => {
    if(!gameHasStarted)
      return;

    const newPos = characterPos - charImpulse;
    if (newPos < 0) {
      setCharacterPos(0)
    } else {      
      setCharacterPos(newPos);
    }
  }

  return (
    <GameContainer>
      <GameBoard ref={gameBoard} onClick={handleCharacterFlying} width={board_Width}>
      <ScoreBoard width={720}>{score}</ScoreBoard>
        <Character size={char_Size} top={characterPos} selectedChar={currentCharacter}/>        
        <GameControls isVisible={!gameHasStarted}>
          <ConfigContainer isVisible={isConfigOpen}>
            <ConfigHeader>
              <ConfigTitle>{t('settings')}</ConfigTitle>
              <ConfigExitButton onClick={handleCloseSettings}>X</ConfigExitButton>
            </ConfigHeader>    
            <ConfigControls>
              <label>
                {t('language')}
              </label>
              <FlagPicker>
              <img 
                  alt="EUA Flag" 
                  src="/flags/us.png" 
                  width={70} 
                  onClick={() => setConfigs({...configs, lang: 'en'})}
                  className="clickable"
                />
                <img 
                  alt="Brazilian Flag" 
                  src="/flags/br.png" 
                  width={70} 
                  onClick={() => setConfigs({...configs, lang: 'pt_BR'})}
                  className="clickable"
                />                
              </FlagPicker>                 
            </ConfigControls>  
            <ConfigControls>
              <label>
                {t('skin')}
              </label>    
            </ConfigControls>   
            <ConfigControls>
            <SkinPicker>
                {availableSkinsNames.map((availableSkins) => {
                  return (
                  <img 
                    key={availableSkins}
                    src={`/chars/${availableSkins}.png`}
                    width={64} 
                    onClick={() => setCurrentCharacter(availableSkins)}
                    alt="Char skin"
                    className="clickable"/>
                  );
                })}
                
              </SkinPicker>
            </ConfigControls>
          </ConfigContainer>
          <ControlButton 
            onClick={handleGameStart}>
              {t('startGame')}
          </ControlButton>
          <ControlButton 
            isHidden={isConfigOpen} 
            onClick={handleOpenSettings}>
              {t('settings')}
            </ControlButton>
        </GameControls>
        <Asteroid 
          width={asteroid_Width} 
          height={asteroidHeight} 
          left={asteroidLeft} 
          top={0} 
          isHidden={!gameHasStarted}/>
        <Asteroid 
          width={asteroid_Width} 
          height={bottomAsteroidHeight} 
          left={asteroidLeft}
          top={bottomAsteroidTop} 
          isHidden={!gameHasStarted}/>
      </GameBoard>
    </GameContainer>
  );
}

export default App;
