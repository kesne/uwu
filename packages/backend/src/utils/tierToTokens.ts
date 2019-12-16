const TIER_1 = 5;
const TIER_2 = 12;
const TIER_3 = 35;

const TIER_TO_TOKENS = {
    1: TIER_1,
    2: TIER_2,
    3: TIER_3,
    Prime: TIER_1,
    '1000': TIER_1,
    '2000': TIER_2,
    '3000': TIER_3,
};

export default function tierToToken(tier: 1 | 2 | 3 | 'Prime' | '1000' | '2000' | '3000') {
    return TIER_TO_TOKENS[tier] || TIER_TO_TOKENS[1];
}
