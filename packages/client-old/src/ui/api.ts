import frontend from 'magic-api/lib/frontend';
import backend from '../backend';

export default frontend<typeof backend>({
    port: 1337,
});
