# PromptTester5000

## To set up:

1. Install node and npm (node v18)
    - enter `node -v` in your console to see which version of node you have
    - if you don't have node, there are many ways to install but easiest is to download the installer from [nodejs.org](https://nodejs.org/)
2. Install `ts-node` (I might eventually compile this to a vanilla js file, but for now you have to do it yourself or run with ts-node)
    - `npm i -g ts-node` is the common way to do this
    - alternatively, you can run ts-node without installing it by using npx (see instructions below). If you want to do that you can skip this step. 
3. Install dependencies in the project
    - `npm install` or `yarn install` (preferred)
    - you can use npm if you don't want to install yarn globally, but the dependencies are managed with yarn so if you run into issues you may need to use yarn. In most cases all you need is `npm i -g yarn`
4. Add a .env file with your OPENAI_API_KEY (see .env.sample)

## To run your experiments

1. Add your test details to your input file (`test-input.csv` is the default but you can specify this when you run your experiments). See `test-input-sample.csv`
    - In this file you can specify as many system messages, human messages, and ai messages as you like depending on your prompt engineering strategy (you can few shot using ai messages, for example). 
        - Each of those columns must be named uniquely, duplicate column names will be skipped and could mess up your output
        - Each of those column names must begin with the string `system_message`, `human_message`, or `ai_message`, respectively. 
        - You must also specify a temperature and modelname for each row in the input

2. Run the tests 
    - you will be prompted to specify input and output file paths. Just hit the enter key to bypass these if you just want to use the defaults. 

    a. with `ts-node`:
        - in your terminal at the root of the project, enter `npm run start` or `yarn start` (preferred)
        
    b. with npx
        - enter `npx ts-node index.ts` (you must have npx installed)

    c. with node.js
        - not currently supported. Need to add a build step that compiles the ts files into a dist as vanilla.js. Feel free to add this on your own if you dare! 
