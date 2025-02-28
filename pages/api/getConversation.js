
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
        // Check if dbAdmin is properly initialized
        if (!dbAdmin || typeof dbAdmin.collection !== 'function') {
            console.error("Firebase not initialized properly");
            return res.status(200).json({ 
              messages: [],
              localFallback: true
            });
        }

        const doc = await dbAdmin.collection("conversations").doc(conversationId).get();

        if (!doc.exists) {
            return res.status(200).json({ messages: [] }); // Return an empty chat history if no data found
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        console.error("Error retrieving conversation:", error);
        return res.status(200).json({ 
          messages: [],
          error: error.message,
          localFallback: true
        });
    }
}
