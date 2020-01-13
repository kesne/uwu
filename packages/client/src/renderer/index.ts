import 'uikit/dist/css/uikit.min.css';
import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import App from './App.svelte';

UIKit.use(Icons);

new App({
    target: document.getElementById('app')!,
});
