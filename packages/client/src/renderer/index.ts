import 'uikit/dist/css/uikit.min.css';
import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import App from './App.svelte';

// @ts-ignore This isn't typed but does exist.
UIKit.use(Icons);

new App({
    target: document.getElementById('app')!,
});
