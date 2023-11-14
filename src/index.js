import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";

import ladderData from "../data/ladder.txt";
import settings from "../data/settings.yaml";

import useHotKeys from "./hooks/useHotKeys";
import useAnswers from "./hooks/useAnswers";

import GlobalStyle from "./styles/GlobalStyle";
import FireworksController from "./components/FireworksController";
import Ladder from "./components/Ladder";
import Rung from "./components/Rung";

import { getMaxWordLength, parseLadderData } from "./utils";
import withThemeProvider from "./styles/withThemeProvider";

const App = () => {
  const [ladder] = useState(parseLadderData(ladderData));
  const { answers, initAnswers, setCorrect, areAllAnswersCompleted } =
    useAnswers();
  const [inputRefs, setInputRefs] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const focusNext = () => {
    inputRefs[focusedIndex + 1]?.current?.focus();
  };
  const focusPrev = () => {
    inputRefs[focusedIndex - 1]?.current?.focus();
  };

  useHotKeys({
    ArrowUp: focusPrev,
    ArrowDown: focusNext,
    Enter: focusNext,
  });

  useEffect(() => {
    // Create refs for each input after ladder is set
    const refs = ladder.map(() => React.createRef());

    setInputRefs(refs);
    initAnswers(ladder.length);
  }, [ladder]);

  useEffect(() => {
    // Focus first input after inputRefs are created
    if (inputRefs.length > 1) {
      inputRefs[0]?.current?.focus();
    }
  }, [inputRefs]);

  const wordLength = getMaxWordLength(ladder);

  return (
    <div>
      <FireworksController emit={areAllAnswersCompleted()} />
      <GlobalStyle />
      {settings.title ? <h1>{settings.title}</h1> : null}
      {settings.rules ? (
        <>
          <h2>The Rules</h2>
          <p>{settings.rules}</p>
        </>
      ) : null}
      {settings.example ? (
        <>
          <h3>For Example:</h3>
          <pre>{settings.example}</pre>
          <p></p>
        </>
      ) : null}
      {settings.showLadderLabel ? <h2>The Ladder</h2> : null}
      <Ladder wordLength={wordLength}>
        {ladder.map(({ clue, answer }, index) => (
          <Rung
            key={clue}
            aRef={inputRefs[index]}
            clue={clue}
            answer={answer}
            correct={answers[index]}
            setCorrect={() => {
              setCorrect(index);
              focusNext();
            }}
            onFocus={() => {
              setFocusedIndex(index);
            }}
            wordLength={wordLength}
          />
        ))}
      </Ladder>
      {settings.closingLink ? (
        <a href={settings.closingLink.link}>{settings.closingLink.label}</a>
      ) : null}
    </div>
  );
};

const ThemedApp = withThemeProvider(App);

const root = document.getElementById("root");
ReactDOM.render(<ThemedApp />, root);
