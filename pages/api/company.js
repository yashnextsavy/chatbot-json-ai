import path from "path";
import fs from "fs";

export default function handler(req, res) {
    const { companyId } = req.query;

    if (!companyId) {
        return res.status(400).json({ error: "companyId is required" });
    }

    try {
        // Construct the path to the JSON file
        const filePath = path.join(process.cwd(), "public", "data", `${companyId}.json`);

        // Read the file
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const companyData = JSON.parse(fileContents);

        // Make sure colors are included in the response
        if (!companyData.colors) {
            // Provide default colors if they don't exist in the data
            companyData.colors = {
                primary: "#4285f4",
                secondary: "#34a853",
                headerBg: "#1a73e8",
                chatBg: "#f0f2f5",
                botMessageBg: "#f1f3f5",
                userMessageBg: "#1a73e8",
                userMessageText: "#ffffff",
                quickReplyBg: "#e8f0fe",
                quickReplyText: "#1a73e8"
            };
        }

        return res.status(200).json(companyData);
    } catch (error) {
        console.error("Error loading company data:", error);
        return res.status(500).json({ error: "Failed to load company data" });
    }
}