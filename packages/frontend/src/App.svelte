<script>
    import Home from './Home.svelte';
</script>

<div>
    <nav class="uk-navbar-container" uk-navbar uk-sticky>
        <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo" href="/">UwU</a>
        </div>
        <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
                <li>
                    <a href="/signout">Sign Out</a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="uk-container uk-margin">
        <Home />
    </div>
</div>
