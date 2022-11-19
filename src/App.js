import './App.css';
import { useEffect, useState } from 'react';
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

const availableSkinsNames =["1", "2", "3", "4"];

const char_Size = 64;
const board_Height = 696;
const board_Width = 720;
const charGravity = 8;
const charImpulse = char_Size * 1.5;
const space_Asteroids = 200;
const asteroid_Width = 40;

function App() {
  
  const initialConfig = {
    lang: "pt_BR",
  }

  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [configs, setConfigs] = useState(initialConfig);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [characterPos, setCharacterPos] = useState((board_Height / 2) - char_Size); 
  const [asteroidHeight, setAsteroidHeight] = useState(100);
  const [asteroidLeft, setAsteroidLeft] = useState(board_Width - asteroid_Width);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const bottomAsteroidHeight = board_Height - space_Asteroids - asteroidHeight;
  const bottomAsteroidTop = board_Height - (bottomAsteroidHeight + asteroidHeight);

  useEffect(() => {
    let backroundAnimationId;
    let position = 0;
    
    if (gameHasStarted) {
      backroundAnimationId = setInterval(() => {
        position -= 5;
        document.getElementById('gameBoard').style.backgroundPositionX= `${position}px`;
      }, 30);
    }
    
    return () => {
      clearInterval(backroundAnimationId);
    };
  }, [gameHasStarted]);

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
  
  useEffect(() =>{
    let asteroidAnimation;
   
    if (gameHasStarted && asteroidLeft >= -asteroid_Width) {
      asteroidAnimation = setInterval(() => {
        let position = asteroidLeft - 5;
        setAsteroidLeft(position);
      }, 30);

      return () => {
        clearInterval(asteroidAnimation);
      };
    } 
    else if(gameHasStarted) {
      setAsteroidLeft(board_Width - asteroid_Width);
      const height = Math.random() * asteroidHeight + space_Asteroids;
      setAsteroidHeight(height);
      let newScore = score +1;
      setScore(newScore);
    }
    
  }, [asteroidHeight, asteroidLeft, gameHasStarted, score]);
 
  useEffect(()=>{
    const collidedWithTopAsteroid = characterPos >= 0 && characterPos < asteroidHeight;
    const collidedWithBottomAsteroid = characterPos >= board_Height - bottomAsteroidHeight;

    if ((asteroidLeft >= 0 && asteroidLeft <= asteroid_Width) && (collidedWithBottomAsteroid || collidedWithTopAsteroid)) {
      setGameHasStarted(false);
      setIsGameOver(true);
    }
  }, [characterPos, asteroidHeight, bottomAsteroidHeight, asteroidLeft]);

  useEffect(() => {
    if (isGameOver) {
      setAsteroidLeft(board_Width - asteroid_Width);
      const height = Math.random() * asteroidHeight + space_Asteroids;
      setAsteroidHeight(height);
      setIsGameOver(false);
    }
  }, [asteroidHeight, isGameOver]);

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
      <GameBoard id="gameBoard" onClick={handleCharacterFlying} width={board_Width}>
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
