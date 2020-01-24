// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as WebSocket from 'ws';

function getSettings() {
    return vscode.workspace.getConfiguration('uwu');
}

let ws: WebSocket | null = null;

export function activate(context: vscode.ExtensionContext) {
    let statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    context.subscriptions.push(statusBar);

	// TODO: Maybe use editor scroll too?
    context.subscriptions.push(
        vscode.commands.registerCommand('type', (args) => {
			// TODO: Do something
			vscode.commands.executeCommand('default:type', args);
        }),
	);

    context.subscriptions.push(
        vscode.commands.registerCommand('uwu.enable', async () => {
            if (ws) {
                vscode.window.showInformationMessage('UwU Already Enabled');
                return;
            }

            statusBar.text = 'Connecting...';
            statusBar.show();

            const { endpoint, cloudToken } = getSettings();

            ws = new WebSocket(`${endpoint}/ws/${cloudToken}`);

            ws.addEventListener('open', () => {
                statusBar.text = '~~ UwU ~~ | Connected';
                vscode.window.showInformationMessage('Connected to UwU');
            });

            ws.addEventListener('error', () => {
                vscode.window.showInformationMessage('Error connecting :(');
            });
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('uwu.disable', () => {
            if (ws) {
                ws.close();
                ws = null;
            }

            statusBar.hide();

            vscode.window.showInformationMessage('Disconnected from UwU');
        }),
    );
}

export function deactivate() {
    if (ws) {
        ws.close();
        ws = null;
    }
}
