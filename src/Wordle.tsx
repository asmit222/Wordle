import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import {
  wordBank,
  backgroundColors,
  boxes,
  keyboardLettersBackgrounds,
} from "./utils/stateHelper.js";

import myData from "./utils/dictionary2.json";
import dictionary2 from "./utils/dictionary.json";

const initialState = {
  wordleBoard: [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ],
  backgroundColors: backgroundColors,
  boxes: boxes,
  currentRow: 0,
  currentSpaceInRow: 0,
  wordToGuess: [],
  keyboardLettersBackgrounds: keyboardLettersBackgrounds,
  dictionary: {},
  wordleWordBank: wordBank,
  boxAnimationClasses: [
    "ani1",
    "ani2",
    "ani3",
    "ani4",
    "ani5",
    "ani6",
    "ani7",
    "ani8",
    "ani9",
  ],
};

const Wordle: React.FC = () => {
  const [state, setState] = React.useState(initialState);
  const [lost, setLost] = React.useState(true);
  const [websterDictionary, setWebsterDictionary] = React.useState({});

  useEffect(() => {
    resetState();
  }, []);

  const resetState = () => {
    initialState.backgroundColors.forEach(
      (backgroundColor: string, i: number) => {
        initialState.backgroundColors[i] = "";
      }
    );
    initialState.boxes.forEach((box: string, i: number) => {
      initialState.boxes[i] = "";
    });

    Object.keys(initialState.keyboardLettersBackgrounds).forEach((key) => {
      initialState.keyboardLettersBackgrounds[key] = "";
    });
    initialState.wordleBoard.forEach((array) => {
      array.forEach((spot, i) => {
        array[i] = "";
      });
    });

    setTimeout(() => {
      setLost(true);
    }, 500);

    setState({ ...state, currentRow: 0, currentSpaceInRow: 0 });

    initialState.wordToGuess = [];

    setTimeout(getNewWord, 500);

    setState(initialState);
    let tempDic = {};

    Object.keys(myData).forEach((key) => {
      if (key.split("").length === 5) {
        tempDic[key] = myData[key];
      }
    });

    setState({
      ...state,
      dictionary: tempDic,
    });
    setGameOver(false);
  };

  const getNewWord = () => {
    let word = wordBank[Math.floor(Math.random() * wordBank.length)]
      .toUpperCase()
      .split("");

    setState({
      ...state,
      wordToGuess: word,
    });
  };

  const handleLetterClick = (letter: string) => {
    //do nothing if row is full
    if (state.currentSpaceInRow < 5) {
      let boardBeforeChange = state.wordleBoard;
      boardBeforeChange[state.currentRow][state.currentSpaceInRow] = letter;
      let newSpace = state.currentSpaceInRow;

      let oldBoxes1 = state.boxes;
      oldBoxes1[
        Number(
          `${state.currentRow.toString()}${state.currentSpaceInRow.toString()}`
        )
      ] = "popAnimation";

      let oldBackgroundColors = state.backgroundColors;
      oldBackgroundColors[
        Number(
          `${state.currentRow.toString()}${state.currentSpaceInRow.toString()}`
        )
      ] = oldBackgroundColors[
        Number(
          `${state.currentRow.toString()}${state.currentSpaceInRow.toString()}`
        )
      ]?.concat(" ", "borderGlow");

      //take out the popAnimation className after 50ms
      setTimeout(() => {
        let oldBoxes2 = state.boxes;
        oldBoxes2[
          Number(
            `${state.currentRow.toString()}${state.currentSpaceInRow.toString()}`
          )
        ] = "";

        setState({
          ...state,
          wordleBoard: boardBeforeChange,
          currentSpaceInRow: newSpace,
          boxes: oldBoxes2,
        });
      }, 50);

      newSpace = state.currentSpaceInRow + 1;

      setState({
        ...state,
        wordleBoard: boardBeforeChange,
        currentSpaceInRow: newSpace,
        boxes: oldBoxes1,
        backgroundColors: oldBackgroundColors,
      });
    }
  };

  const handleEnterClick = () => {
    if (
      wordIsAWord(state.wordleBoard[state.currentRow].join("").toLowerCase())
    ) {
      checkForWinOrLose();
      if (state.currentSpaceInRow === 5) {
        setBackgroundColors();
        setCurrentBoardSpace();
      }
    } else {
      showNotAWordModal();
      setTimeout(handleClose2, 1000);
    }
  };

  //========================================= BACKGROUND COLOR SETTING ===========================================
  const determineBackgroundToSet = (letter: string, i: number) => {
    if (
      state.wordToGuess.indexOf(letter) !== -1 &&
      (state.wordToGuess.indexOf(letter) === i ||
        state.wordToGuess[i] === letter)
    ) {
      return "greenBackground";
    } else if (state.wordToGuess.indexOf(letter) !== -1) {
      return "orangeBackground";
    } else {
      return "grayBackground";
    }
  };

  const setBackgroundColors = () => {
    state.wordleBoard[state.currentRow].forEach((letter, i) => {
      const backgroundToSet = determineBackgroundToSet(letter, i);

      let keyboardLettersBackgrounds = state.keyboardLettersBackgrounds;
      keyboardLettersBackgrounds[letter] = backgroundToSet;
      let backgroundColors = state.backgroundColors;
      backgroundColors[Number(`${state.currentRow}${i}`)] = backgroundToSet;
      setState({
        ...state,
        backgroundColors: backgroundColors,
        keyboardLettersBackgrounds: keyboardLettersBackgrounds,
      });
    });
  };
  // ===========================================================================================================

  const setCurrentBoardSpace = () => {
    if (state.currentRow < 5) {
      setState({
        ...state,
        currentRow: state.currentRow + 1,
        currentSpaceInRow: 0,
      });
    } else {
      setState({
        ...state,
        currentRow: 0,
        currentSpaceInRow: 0,
      });
    }
  };

  // ===================================== CHECK AND HANDLE WIN OR LOSE =========================================
  const checkForWinOrLose = () => {
    if (
      state.wordleBoard[state.currentRow].join("") ===
      state.wordToGuess.join("")
    ) {
      setTimeout(handleWin, 1500);
    } else if (state.currentRow === 5) {
      handleLose();
    }
  };

  const handleLose = () => {
    setLost(true);
    showPlayAgainModal();
    setGameOver(true);
  };

  const wordIsAWord = (word: string) => {
    let isAWord = false;

    if (myData[word] !== undefined) {
      isAWord = true;
    } else if (websterDictionary[word] !== undefined) {
      isAWord = true;
    } else if (dictionary2[word] !== undefined) {
      isAWord = true;
    } else if (state.wordleWordBank.indexOf(word) !== -1) {
      isAWord = true;
    }
    return isAWord;
  };

  const handleWin = () => {
    setLost(false);
    setState({ ...state, currentRow: 0, currentSpaceInRow: 0 });
    showPlayAgainModal();
    setGameOver(true);
  };
  // ===========================================================================================================

  const handleBackSpace = () => {
    if (state.currentSpaceInRow > 0) {
      removeBorderGlow();
      setSpaceBackBy1();
    }
  };

  const setSpaceBackBy1 = () => {
    let boardBeforeChange = state.wordleBoard;
    boardBeforeChange[state.currentRow][state.currentSpaceInRow - 1] = "";
    let newSpace = state.currentSpaceInRow - 1;
    setState({
      ...state,
      wordleBoard: boardBeforeChange,
      currentSpaceInRow: newSpace,
    });
  };

  const removeBorderGlow = () => {
    let oldBackgroundColors = state.backgroundColors;
    oldBackgroundColors[
      Number(
        `${state.currentRow.toString()}${(
          state.currentSpaceInRow - 1
        ).toString()}`
      )
    ] = oldBackgroundColors[
      Number(
        `${state.currentRow.toString()}${(
          state.currentSpaceInRow - 1
        ).toString()}`
      )
    ].replace("borderGlow", "");
  };

  const getRandomBoxAnimation = () => {
    return state.boxAnimationClasses[
      Math.floor(Math.random() * state.boxAnimationClasses.length)
    ];
  };

  // ============================================== BOARD =============================================
  const boardComponent = state.wordleBoard.map((item, i) => {
    const rows = [0, 1, 2, 3, 4];
    const rowsItem = rows.map((row) => {
      return (
        <div className={`box${row + 1} ${state.boxes[Number(`${i}${row}`)]}`}>
          <p
            className={`wordleLetterInBox ${getRandomBoxAnimation()} ${
              state.backgroundColors[Number(`${i}${row}`)]
            }`}
          >
            {state.wordleBoard[i][row]}
          </p>
        </div>
      );
    });
    return (
      <div className={`rowContainer${i}`}>
        <div className={`row${i}`}>{rowsItem}</div>
      </div>
    );
  });
  // ===================================================================================================

  // =========================================== KEYBOARD ==============================================
  const QthroughP = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keyboardQthroughP = QthroughP.map((letter) => {
    return (
      <button
        onClick={() => {
          handleLetterClick(letter);
        }}
        className={`keyboardLetterBox ${state.keyboardLettersBackgrounds[letter]}`}
      >
        {letter}
      </button>
    );
  });

  const AthroughL = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keyboardAthroughL = AthroughL.map((letter) => {
    return (
      <button
        onClick={() => {
          handleLetterClick(letter);
        }}
        className={`keyboardLetterBox ${state.keyboardLettersBackgrounds[letter]}`}
      >
        {letter}
      </button>
    );
  });

  const ZthroughM = ["Z", "X", "C", "V", "B", "N", "M"];
  const keyboardZthroughM = ZthroughM.map((letter) => {
    return (
      <button
        onClick={() => {
          handleLetterClick(letter);
        }}
        className={`keyboardLetterBox ${state.keyboardLettersBackgrounds[letter]}`}
      >
        {letter}
      </button>
    );
  });
  // ============================================================================================

  const playAgainModal = () => {
    return (
      <Modal
        className="my-modal"
        scrollable={true}
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{lost ? `You Lose :(` : `You Win!`}</Modal.Title>
        </Modal.Header>
        <div className="modal-body-container">
          <Modal.Body>
            {`The word was `} <b>{`${state.wordToGuess.join("")}`}</b>
            {` - ${
              websterDictionary[state.wordToGuess.join("").toLowerCase()]
            }`}
          </Modal.Body>
        </div>

        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const notAWordModal = () => {
    return (
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Modal.Title>{`${state.wordleBoard[state.currentRow].join(
            ""
          )} is not a word.`}</Modal.Title>
        </Modal.Header>
      </Modal>
    );
  };

  const handlePlayAgain = () => {
    resetState();
  };

  // ========================= MODAL FUNCTIONS =========================================================
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const showPlayAgainModal = () => setShow(true);
  // ===============================================================
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
    setShow2(false);
  };

  const showNotAWordModal = () => setShow2(true);

  // ====================================================================================================

  const [gameOver, setGameOver] = React.useState(false);

  return (
    <div className="wordleContainer">
      {/* ================================================= MODALS ====================================== */}
      {playAgainModal()}
      {notAWordModal()}
      {/* ================================================================================================ */}

      <div className="wordleGameArea">{boardComponent}</div>
      {!gameOver ? (
        <div className="wordleKeyboardArea fadeIn">
          <div className="keyboardRowContainer">
            <div className="keyboardRow1">{keyboardQthroughP}</div>
          </div>
          <div className="keyboardRowContainer">
            {" "}
            <div className="keyboardRow2"> {keyboardAthroughL}</div>
          </div>
          <div className="keyboardRowContainer">
            {" "}
            <div className="keyboardRow3">
              {" "}
              <button
                onClick={handleEnterClick}
                className="keyboardLetterBoxEnter"
              >
                ENTER
              </button>
              {keyboardZthroughM}
              <button
                onClick={handleBackSpace}
                className="keyboardLetterBoxBack"
              ></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="wordlePlayAgainButtonsArea fadeIn">
          {" "}
          <Button size="lg" variant="light" onClick={handlePlayAgain}>
            Play Again
          </Button>
          {/* <Button className="statsButton" size="lg" variant="outline-light">
            Stats
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default Wordle;
