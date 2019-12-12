const TIER_TO_TOKENS = {
    1: 5,
    2: 12,
    3: 35,
};

export default function tierToToken(tier: 1 | 2 | 3) {
    return TIER_TO_TOKENS[tier] || TIER_TO_TOKENS[1];
}
