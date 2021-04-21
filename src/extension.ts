// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import * as webhook from "webhook-discord"
import * as path from "path"
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("misterbeam.submitBeam", registerSubmitBean)

    context.subscriptions.push(disposable)
}

async function registerSubmitBean() {
    const discordWebhookUrl: string | undefined = vscode.workspace
        .getConfiguration("misterbeam")
        .get("discordWebhookUrl")
    if (!discordWebhookUrl) {
        vscode.window.showInformationMessage("Please specify a webhook url.")
    } else {
        const hook = new webhook.Webhook(discordWebhookUrl)
        const filePath = vscode.window.activeTextEditor?.document.fileName
        const editor = vscode.window.activeTextEditor
        let cursorPosition = editor?.selection.start
        let selected = editor?.document.getText(editor.selection)
        if (!selected) {
            console.log("Nothing selected")
        } else {
            if (cursorPosition) {
                if (filePath) {
                    console.log(filePath)
                    console.log(path.basename(filePath))
                    const fileName = path.basename(filePath)
                    const ext = fileName.split(".")[fileName.split(".").length - 1]
                    const msg = new webhook.MessageBuilder().setName("Mister Beam").setText(`\`\`\`${ext}\n
${selected}
\`\`\``)
                    await hook.send(msg)
                }
            }
        }

        vscode.window.showInformationMessage("Beamed it up!")
    }
}

export function deactivate() {}
