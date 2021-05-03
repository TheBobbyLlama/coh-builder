import { StoreProvider } from "./utils/GlobalState";

import CharacterCreator from "./pages/CharacterCreator/CharacterCreator";

import "./App.css";

function App() {
  return (
    <StoreProvider>
      <CharacterCreator />
    </StoreProvider>
  );
}

export default App;
