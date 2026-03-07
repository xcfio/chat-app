import { Date, UUID } from "./utility"
import Type from "typebox"

export const Conversation = Type.Object({
    id: UUID,
    participant: UUID,
    createdAt: Date,
    updatedAt: Date
})
