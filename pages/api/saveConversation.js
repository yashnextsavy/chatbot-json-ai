
// pages/api/saveConversation.js
import admin from "firebase-admin";
import { dbAdmin } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    const { conversationId, messages } = req.body;

    if (!conversationId || !messages) {
        return res.status(400).json({ error: "Missing conversationId or messages" });
    }

    try {
        // Check if dbAdmin is properly initialized
        if (!dbAdmin || typeof dbAdmin.collection !== 'function') {
            console.error("Firebase not initialized properly");
            // Use local storage fallback for development
            return res.status(200).json({ 
              message: "Conversation saved locally (Firebase unavailable)", 
              localFallback: true 
            });
        }

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
        return res.status(200).json({ 
          message: "Failed to save to Firebase, using local storage", 
          error: error.message,
          localFallback: true 
        });
    }
}
