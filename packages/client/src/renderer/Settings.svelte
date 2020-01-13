<script context="module">
    /// TODO: Maybe just move this into a constants file.
    export const SETTINGS_KEY = 'settings-v1';
</script>

<script>
    import store from './utils/store';

    const currentSettings = store.get(SETTINGS_KEY) || {};

    function handleSubmit(e) {
        const formData = new FormData(e.target);
        store.set(SETTINGS_KEY, Object.fromEntries(formData));
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

<div id="settings-modal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Settings</h2>
        <form class="uk-form-stacked" on:submit|preventDefault={handleSubmit}>
            <div class="uk-margin">
                <label class="uk-form-label" for="obs-websocket-address-input">OBS Websocket Address</label>
                <div class="uk-form-controls">
                    <input
                        class="uk-input"
                        id="obs-websocket-address-input"
                        type="password"
                        name="websocket"
                        value={currentSettings.websocket || ''}
                        placeholder="Secret..." />
                </div>
            </div>
            <div class="uk-margin">
                <label class="uk-form-label" for="websocket-secret-input">Websocket Secret</label>
                <div class="uk-form-controls">
                    <input
                        class="uk-input"
                        id="websocket-secret-input"
                        type="password"
                        name="websocket"
                        value={currentSettings.websocket || ''}
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
            <div class="uk-margin">
                <label class="uk-form-label" for="hue-api-key-input">HUE API Key</label>
                <div class="uk-form-controls">
                    <input
                        class="uk-input"
                        id="hue-api-key-input"
                        type="password"
                        name="hue"
                        value={currentSettings.hue || ''}
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
