// pages/api/saveConversation.js
import admin from "firebase-admin";
import { dbAdmin } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    const { conversationId, messages } = req.body;

    if (!conversationId || !messages) {
        return res.status(400).json({ error: "Missing conversationId or messages" });
    }

    try {
        await dbAdmin.collection("conversations").doc(conversationId).set(
            {
                messages,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
        return res.status(200).json({ message: "Conversation saved" });
    } catch (error) {
        console.error("Error saving conversation:", error);
        return res.status(500).json({ error: error.message });
    }
}
