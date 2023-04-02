# RVS
## Computer Science Independent Study Project:
Real Time Data Generation, Server Upload and Visualization


Note: This is for a school project, please do not use it to cheat.


## Data Generation
Data will be generated from Dr. Xiao's Game Design class. Developers
will store and create a csv file that contains information such as leaderboards
for their local run machine. Using a Python script, developers will be able to upload 
their local leaderboards to a Mongo DB hosted on an Atlas server.

Note: Future implementations of other game metrics will be considered once baseline functionality
is completed

## Data Preproccessing
Utilizing Mongo DB non-relational attributes, data imported can exist in any form as a 
csv or adjacent file extension. Data will be preprocessed on the server to fit certain schematics
to ease frontend use.

## Data Storage
Data will be stored utilziing Mongo DB, where access will be given to Dr. Xiao for future
courses.

## Back-End
Currently Mongo Realms for API usage. As of now, we assume that Realms will provide all 
of the needed functionality.

## Front-End
The UI will be created using Next.JS and React. It will be desinged to showcase information
of the leaderboards from the imported games to any user with zero authentication. It will also
be hosted on Vercel and remain so for the time being. 

The application will start at http://localhost:3000 by default.

## Visualization Tools
For this iteration, React Libraries such as ChartJS and ReactVis will be used to showcase 
example usage.

## CICD
Git hooks are a way to automate certain tasks triggered by git. This boilerplate uses conventional commits, so our git-hooks help us make sure our commit messages are following the correct standards before committing.

commit-msg is run when you enter your commit message, and makes sure its following the right naming conventions.

prepare-commit-msg is run when you open up the commit file (you may or may not do this in your general workflow, and that okay). All this does is add an extra newline so that if your entering a commit message from the CLI, you don't get a warning about spaces before body content.

Dependencies
These use the commitlint cli tool. Install this via your node package manager.

>yarn global add @commitlint/config-conventional @commitlint/cli
># or
>npm install --global @commitlint/config-conventional @commitlint/cli
># etc

Setup
If you want to enable these in your workflow, make sure you run

>git config core.hooksPath ".git-hooks"
This tells git where to look for git-hooks.
