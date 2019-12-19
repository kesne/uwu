import { gql } from 'apollo-server-express';
import fs from 'fs';
import path from 'path';

export default gql(
    // TODO: Move this back to src? I need to copy the file manually if I do that as part of build.
    fs.readFileSync(path.join(__dirname, '..', 'schema.graphql'), 'utf8'),
);
