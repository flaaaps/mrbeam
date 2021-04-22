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
    const config = vscode.workspace.getConfiguration("misterbeam")
    const discordWebhookUrl: string | undefined = config.get("discordWebhookUrl")
    const userImageUrl: string | undefined = config.get("imageUrl")
    const username: string | undefined = config.get("username")
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
            vscode.window.showInformationMessage("Select some code to beam up.")
        } else {
            if (cursorPosition && filePath) {
                console.log(filePath)
                console.log(path.basename(filePath))
                const fileName = path.basename(filePath)
                let ext = fileName.split(".")[fileName.split(".").length - 1]
                if (ext === "tsx") ext = "ts"
                else if (ext === "jsx") ext = "js"
                const msg = new webhook.MessageBuilder()
                    .setName("Mister Beam")
                    .setAuthor(username ?? "User", userImageUrl)
                    .setTitle(fileName)
                    .setDescription(
                        `\`\`\`${ext}\n
${selected}
\`\`\``
                    )
                    .setFooter("Made with ❤️ by flaaaps", "https://content.wening.me/mrbeam/logos/logo-white.png")
                    .setTime(Date.now() / 1000)

                await hook.send(msg)
                vscode.window.showInformationMessage("Beamed it up!")
            }
        }
    }
}

export function deactivate() {
    console.log("Disabling extension")
}
