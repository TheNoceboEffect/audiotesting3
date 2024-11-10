// Removed references of all .css files, due to me choosing to use an alert system in my extension, as opposed to opening a completely new page to click a button to play sounds.

import Crunker from "crunker";

function App() {
  
  let crunker = new Crunker();

  const handleCrunkerConcat = () => {
    crunker
      .fetchAudio("../../sounds/e.wav", "../../sounds/b.wav")
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
      .fetchAudio("../../sounds/e.wav", "../../sounds/b.wav")
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

  //I am thinking of using alerts instead of buttons. If I use alerts instead of buttons, will I need to remove the 'return' function, or replace it with other code entirely?
  
  return (
    <>
      <button onClick={handleCrunkerMerge}>crunker merge example</button>
      <button onClick={handleCrunkerConcat}>crunker concat example</button>
    </>
  );
}

export default App;
