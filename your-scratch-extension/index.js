const audioEngine = Scratch.vm.runtime.audioEngine;
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {

    constructor (runtime) {
        runtime.audioEngine
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo () {
        return {
            // unique ID for your extension
            id: 'yourScratchExtension',

            // name that will be displayed in the Scratch UI
            name: 'ScratchSpeech',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // icons to display
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // your Scratch blocks
            blocks: [
                {
                    // name of the function where your block code lives
                    opcode: 'speak',

                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: 'speak [url]',

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [ TargetType.SPRITE, TargetType.STAGE ],

                    // arguments used in the block
                    arguments: {
                        url: {
                            // default value before the user sets something
                            defaultValue: 'https://extensions.turbowarp.org/meow.mp3',

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.STRING
                        }
                    }
                }
            ]
        };
    }


    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    speak ({url}) {
        // example implementation to return a string
        const audioEngine = Scratch.vm.runtime.audioEngine;

  /**
   * This method assumes that the caller has already requested permission to fetch the URL.
   * @param {string} url
   * @returns {Promise<ArrayBuffer>}
   */
  const fetchAsArrayBufferWithTimeout = (url) =>
    new Promise((resolve, reject) => {
      // Permission is checked in playSound()
      // eslint-disable-next-line no-restricted-syntax
      const xhr = new XMLHttpRequest();
      let timeout = setTimeout(() => {
        xhr.abort();
        reject(new Error("Timed out"));
      }, 5000);
      xhr.onload = () => {
        clearTimeout(timeout);
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
        }
      };
      xhr.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to request ${url}`));
      };
      xhr.responseType = "arraybuffer";
      xhr.open("GET", url);
      xhr.send();
    });

  /**
   * @type {Map<string, {sound: AudioEngine.SoundPlayer | null, error: unknown}>}
   */
  const soundPlayerCache = new Map();

  /**
   * @param {string} url
   * @returns {Promise<AudioEngine.SoundPlayer>}
   */
  const decodeSoundPlayer = async (url) => {
    const cached = soundPlayerCache.get(url);
    if (cached) {
      if (cached.sound) {
        return cached.sound;
      }
      throw cached.error;
    }

    try {
      const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
      const soundPlayer = await audioEngine.decodeSoundPlayer({
        data: {
          buffer: arrayBuffer,
        },
      });
      soundPlayerCache.set(url, {
        sound: soundPlayer,
        error: null,
      });
      return soundPlayer;
    } catch (e) {
      soundPlayerCache.set(url, {
        sound: null,
        error: e,
      });
      throw e;
    }
  };

  /**
   * @param {string} url
   * @param {VM.Target} target
   * @returns {Promise<boolean>} true if the sound could be played, false if the sound could not be decoded
   */
  const playWithAudioEngine = async (url, target) => {
    const soundBank = target.sprite.soundBank;

    /** @type {AudioEngine.SoundPlayer} */
    let soundPlayer;
    try {
      const originalSoundPlayer = await decodeSoundPlayer(url);
      soundPlayer = originalSoundPlayer.take();
    } catch (e) {
      console.warn(
        "Could not fetch audio; falling back to primitive approach",
        e
      );
      return false;
    }

    soundBank.addSoundPlayer(soundPlayer);
    await soundBank.playSound(target, soundPlayer.id);

    delete soundBank.soundPlayers[soundPlayer.id];
    soundBank.playerTargets.delete(soundPlayer.id);
    soundBank.soundEffects.delete(soundPlayer.id);

    return true;
  };

  /**
   * This method assumes that the caller has already requested permission to fetch the URL.
   * @param {string} url
   * @param {VM.Target} target
   * @returns {Promise<void>}
   */
  const playWithAudioElement = (url, target) =>
    new Promise((resolve, reject) => {
      // Unfortunately, we can't play all sounds with the audio engine.
      // For these sounds, fall back to a primitive <audio>-based solution that will work for all
      // sounds, even those without CORS.
      // Permission is checked in playSound()
      // eslint-disable-next-line no-restricted-syntax
      const mediaElement = new Audio(url);

      // Make a minimal effort to simulate Scratch's sound effects.
      // We can get pretty close for volumes <100%.
      // playbackRate does not have enough range for simulating pitch.
      // There is no way for us to pan left or right.
      mediaElement.volume = target.volume / 100;

      mediaElement.onended = () => {
        resolve();
      };
      mediaElement
        .play()
        .then(() => {
          // Wait for onended
        })
        .catch((err) => {
          reject(err);
        });
    });

  /**
   * @param {string} url
   * @param {VM.Target} target
   * @returns {Promise<void>}
   */
  const playSound = async (url, target) => {
    try {
      if (!(await Scratch.canFetch(url))) {
        throw new Error(`Permission to fetch ${url} denied`);
      }

      const success = await playWithAudioEngine(url, target);
      if (!success) {
        return await playWithAudioElement(url, target);
      }
    } catch (e) {
      console.warn(`All attempts to play ${url} failed`, e);
      play({ path }, util); {
        playSound(path, util.target);
                }
            }
        };
    }
}

module.exports = Scratch3YourExtension;
