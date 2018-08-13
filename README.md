# bedrock-cli

bedrock-cli is the command line interface to [Bedrock](bedrock.mono.company).

### How to install

    npm install -g bedrock-cli

### Usage

#### `bedrock upgrade`

This command upgrades your current Bedrock project to the latest core Bedrock code. Everything in `core/` will be replaced,
along with some other files. Your files in `content/` will not be changed.

#### `bedrock upgrade --dev`

Upgrade referencing Bedrock's `develop` branch instead of master. Warning: for advanced users only.

#### `bedrock init`

Initialize a new Bedrock project.

