<script>
    import TotalTokens from './TotalTokens.svelte';
    import GiftTokens from './GiftTokens.svelte';

    export let user;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
    <div class="flex items-center mb-4">
        <div class="flex items-center flex-1">
            <h2
                class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9
                sm:truncate">
                {user.name}
            </h2>
            <span
                class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium
                leading-5 bg-gray-200 text-gray-800">
                {user.tokens.length} tokens
            </span>
        </div>
        <GiftTokens {user} />
    </div>
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            {#each user.tokens as token}
                <li>
                    <div class="flex items-center px-4 py-4 sm:px-6">
                        <div class="min-w-0 flex-1 flex items-center">
                            <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <div
                                        class="text-sm leading-5 font-medium text-indigo-600
                                        truncate">
                                        {token.reason}
                                    </div>
                                </div>
                                <div class="hidden md:block">
                                    <div>
                                        <div class="text-sm leading-5 text-gray-900">
                                            Created at
                                            <time
                                                datetime={new Date(Number(token.createdAt)).toString()}>
                                                {new Date(Number(token.createdAt)).toDateString()}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div>

<TotalTokens />
