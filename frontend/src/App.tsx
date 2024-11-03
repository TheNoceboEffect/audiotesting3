import Crunker from "crunker";
import "./App.css";

function App() {
  
  let crunker = new Crunker();

  const handleCrunkerConcat = () => {
    crunker
      .fetchAudio("../sounds/e.wav", "../sounds/b.wav")
      .then((buffers) => {
        // => [AudioBuffer, AudioBuffer]
        return crunker.concatAudio(buffers);
      })
      .then((merged) => {
        // => AudioBuffer
        return crunker.export(merged, "audio/mp3");
      })
      .then((output) => {
        // => {blob, element, url}
        crunker.download(output.blob);
        document.body.append(output.element);
        console.log(output.url);
      })
      .catch((error) => {
        // => Error Message
      });

    crunker.notSupported(() => {
      // Handle no browser support
    });
  };



  
  const handleCrunkerMerge = () => {
    crunker
      .fetchAudio("../sounds/e.wav", "../sounds/b.wav")
      .then((buffers) => {
        // => [AudioBuffer, AudioBuffer]
        return crunker.mergeAudio(buffers);
      })
      .then((merged) => {
        // => AudioBuffer
        return crunker.export(merged, "audio/mp3");
      })
      .then((output) => {
        // => {blob, element, url}
        crunker.download(output.blob);
        document.body.append(output.element);
        console.log(output.url);
      })
      .catch((error) => {
        // => Error Message
      });

    crunker.notSupported(() => {
      // Handle no browser support
    });
  };

  return (
    <>
      <button onClick={handleCrunkerMerge}>crunker merge example</button>
      <button onClick={handleCrunkerConcat}>crunker concat example</button>
    </>
  );
}

export default App;
