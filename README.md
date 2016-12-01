# bedrock-cli

bedrock-cli is the command line interface to [Bedrock](bedrock.mono.company).

### How to install

    npm install -g bedrock-cli

### Usage

#### `bedrock init [template]`
`template` is optional: it can either be omitted to initialize a Bedrock project with no content, or you can choose one
of the following templates:

- [`bootstrap`](https://github.com/mono-company/bedrock-template-bootstrap): A modified Bootstrap with expanded Bootstrap components.

#### `bedrock upgrade`
This command upgrades your current Bedrock project to the latest core Bedrock code. Everything in `core/` will be replaced,
along with some other files. Your files in `content/` will not be changed.
