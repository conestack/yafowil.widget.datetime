// The popper UMD bundle registers ``window.Popper``. The widget code imports
// popper as default export, which the UMD bundle does not provide as module.
import '../../node_modules/@popperjs/core/dist/umd/popper.js';

export default window.Popper;
