import { macroCondition, isTesting } from '@embroider/macros';

const loadedScripts = {};
let loadScript;
if (macroCondition(isTesting())) {
  loadScript = async () => {
    return Promise.resolve();
  };
} else {
  /**
   * Loads a script into a document, ensuring it's loaded only once when loading in the main browser
   * document.
   *
   * @param {string} url        The script to load
   * @param {object} opts       Options for loading the script
   * @param {boolean} opts.async Optional. Whether to load the script asynchronously (default: true).
   * @returns {Promise<void>}   Resolves when the script is successfully loaded.
   */
  loadScript = async (url, {
    async = true,
    onLoad = () => {},
    onError = () => {}
  } = {}) => {
    // Return cached promise if present
    if (loadedScripts[url]) {
      return loadedScripts[url];
    }

    // Create a new promise for loading the script
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = async;
      script.src = url;
      script.addEventListener('load', () => {
        onLoad();
        resolve();
      }, false);
      script.addEventListener('error', () => {
        const error = new Error(`Could not load script: ${url}`);
        onError(error);
        reject(error);
      }, false);
      document.body.appendChild(script);
    });
    loadedScripts[url] = promise;
    return promise;
  };
}

export { loadScript };
//# sourceMappingURL=load-script.js.map
