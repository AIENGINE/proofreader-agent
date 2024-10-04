import 'dotenv/config';
import { Pipe } from '@baseai/core';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import TerminalRenderer from 'marked-terminal';
import pipeProofreaderAgent from './baseai/pipes/proofreader-agent';
import { marked } from 'marked';

const pipe = new Pipe(pipeProofreaderAgent());

// Set up marked with the terminal renderer
// marked.setOptions({
//     renderer: new TerminalRenderer()
//   });
  

async function main() {
    console.log(chalk.green('Hi I am Proofreader, you can now proofread your docs that are placed in memory!'));
    console.log(chalk.yellow('Type "exit" to quit the application.\n'));

    while (true) {
        const { userMsg } = await inquirer.prompt([
            {
                type: 'input',
                name: 'userMsg',
                message: chalk.blue('Enter your query (or type "exit" to quit):'),
            },
        ]);

        if (userMsg.toLowerCase() === 'exit') {
            console.log(chalk.green('Goodbye!'));
            break;
        }

        const spinner = ora('Processing your request...').start();

        try {
            const { completion: linuxAgentResp } = await pipe.run({
                messages: [{ role: 'user', content: userMsg }],
            });

            spinner.stop();
            console.log(chalk.cyan('Agent:'));
            console.log(linuxAgentResp);
            // console.log(marked(linuxAgentResp));
        } catch (error) {
            spinner.stop();
            console.error(chalk.red('Error processing your request:'), error);
        }
    }
}

main();