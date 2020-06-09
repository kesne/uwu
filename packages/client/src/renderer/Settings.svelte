<script>
    import store from './utils/store';
    import { SETTINGS_KEY } from './constants';

    let modal;
    const currentSettings = store.get(SETTINGS_KEY, {});

    function handleSubmit(e) {
        const formData = new FormData(e.target);
        store.set(SETTINGS_KEY, Object.fromEntries(formData));
        // UIKit.modal(modal).hide();
    }
</script>

<ul class="uk-navbar-nav uk-margin-small-right">
    <li>
        <button class="uk-button uk-button-default" uk-toggle="target: #settings-modal">
            Settings
            <span class="uk-icon uk-margin-small-left" uk-icon="icon: settings" />
        </button>
    </li>
</ul>

<div id="settings-modal" uk-modal bind:this={modal}>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Settings</h2>
        <form class="uk-form-stacked" on:submit|preventDefault={handleSubmit}>
            <div class="uk-margin">
                <label class="uk-form-label" for="uwu-cloud-input">UWU Cloud Secret</label>
                <div class="uk-form-controls">
                    <input
                        class="uk-input"
                        id="uwu-cloud-input"
                        type="password"
                        name="uwu"
                        value={currentSettings.uwu || ''}
                        placeholder="Secret..." />
                </div>
            </div>
            <div class="uk-margin">
                <label class="uk-form-label" for="twitch-bot-oauth-input">
                    Twitch Bot OAuth Token
                </label>
                <div class="uk-form-controls">
                    <input
                        class="uk-input"
                        id="twitch-bot-oauth-input"
                        type="password"
                        name="twitch"
                        value={currentSettings.twitch || ''}
                        placeholder="Secret..." />
                </div>
            </div>
            <div class="uk-margin">
                <label class="uk-form-label" for="lifx-api-key-input">LIFX API Key</label>
                <div class="uk-form-controls">
                    <input
                        class="uk-input"
                        id="lifx-api-key-input"
                        type="password"
                        name="lifx"
                        value={currentSettings.lifx || ''}
                        placeholder="Secret..." />
                </div>
            </div>
            <p class="uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">
                    Cancel
                </button>
                <button class="uk-button uk-button-primary" type="submit">Save</button>
            </p>
        </form>
    </div>
</div>
