import { AllowedMentionsTypes } from "discord-api-types/v10"
import { SnowTransfer } from "snowtransfer"

export const client = new SnowTransfer(process.env.TOKEN, {
    allowed_mentions: {
        replied_user: true,
        parse: [AllowedMentionsTypes.Everyone, AllowedMentionsTypes.Role, AllowedMentionsTypes.User]
    }
})
