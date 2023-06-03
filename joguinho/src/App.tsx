import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg'

import { Button } from './components/Button';
import {InfoItem} from './components/infoItem'
import { GridItem } from './components/GridItem';

import {items} from './data/items'
import { GridItemType } from './types/GridItemType';
import { formatTimeElaspsed } from './helpers/formatTimeElaspsed';


 
function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElaspsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCoumt, setShowcount] = useState<number>(0);
  const[gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(),[]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElaspsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  },[playing, timeElaspsed]);

  // verify if opened are equal
  useEffect(() => {
    if(showCoumt === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {
 
        if(opened[0].item === opened[1].item) {
         // v1 - se eles sao iguais, torna-los permanentes
         let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShowcount(0);
        } else {
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShowcount(0);
          }, 1000)
        }
        setMoveCount(moveCount => moveCount + 1);
      }
    }
  },[showCoumt, gridItems]);

  // verify if game is over
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);
 
  const resetAndCreateGrid = () => {
    // passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShowcount(0);

    // passo 2 - criar o grid 
    // 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++)  tmpGrid.push({
        item: null, shown: false, permanentShown: false
      });
    // 2.2 - preencher o grid
      for(let w = 0; w < 2; w++){
        for(let i = 0; i < items.length; i++) {
          let pos = -1;
          while(pos < 0 || tmpGrid[pos].item !== null) {
           pos = Math.floor(Math.random() * (items.length * 2));
          } 
          tmpGrid[pos].item = i;
        }
      }
    // 2.3 - jogar no state
    setGridItems(tmpGrid);

    // passo 3 - comerçar o jogo
    setPlaying(true);
    

  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && showCoumt < 2) {
      let tmpGrid = [...gridItems];
      if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShowcount(showCoumt + 1);
      }
      setGridItems(tmpGrid);
    }
  }
  

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElaspsed(timeElaspsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>  

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />  
      </C.Info>
      <C.GridArea>
          <C.Grid>
            {gridItems.map((item, index) => (
              <GridItem 
                key={index}
                item={item}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App
