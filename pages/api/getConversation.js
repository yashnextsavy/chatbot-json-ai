// pages/api/getConversation.js
import { dbAdmin } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { conversationId } = req.query;

    if (!conversationId) {
        return res.status(400).json({ error: "Missing conversationId" });
    }

    try {
        const doc = await dbAdmin.collection("conversations").doc(conversationId).get();

        if (!doc.exists) {
            return res.status(200).json({ messages: [] }); // Return an empty chat history if no data found
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        console.error("Error retrieving conversation:", error);
        return res.status(500).json({ error: error.message });
    }
}
