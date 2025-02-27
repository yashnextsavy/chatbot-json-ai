import { loadCompanyData } from "../../lib/companyData";

export default async function handler(req, res) {
  const { message, companyId } = req.body;
  if (!message || !companyId) {
    return res.status(400).json({ error: "Missing message or companyId", message, companyId });
  }
  // Load and normalize company data
  const rawData = loadCompanyData(companyId);
  // Optionally, normalize the data here
  const companyData = rawData; // Assume it's already in the general format

  const context = generatePromptContext(companyData);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-exp-1206:free",
        messages: [
          { role: "system", content: context },
          { role: "user", content: message }
        ],
        // max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error("Error from openrouter.ai:", await response.text());
      return res.status(500).json({ error: "Error communicating with AI" });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// A utility function to generate the AI context prompt from companyData
function generatePromptContext(companyData) {
  return `
You are a friendly and knowledgeable customer service chatbot representing ${companyData.company?.name || "this company"}.

### Company Details:
- **Name:** ${companyData.company?.name || "Not available"}
- **Established:** ${companyData.company?.established || "Not available"}
- **Location:** ${companyData.company?.location || "Not available"}
- **Description:** ${companyData.company?.description || "No description available."}
- **Company Image:** ${companyData.company?.image ? `Available at ${companyData.company.image}` : "No image uploaded."}

### Services:
${companyData.services?.length > 0
      ? companyData.services.map(service => `
- **${service.name}**: ${service.description || "Description not provided."}
  - Features: ${service.features?.length > 0 ? service.features.join(", ") : "No features listed."}
 
`).join("\n")
      : "No services listed."}

### FAQs:
${companyData.faq?.length > 0
      ? companyData.faq.map(faq => `- **Q:** ${faq.question} \n  **A:** ${faq.answer || "Answer not available."}`).join("\n")
      : "No FAQs available."}

### Team Members:
${companyData.team?.length > 0
      ? companyData.team.map(member => `- ${member.name || "Unnamed"} (${member.position || "Position not specified"})`).join("\n")
      : "No team information available."}

### Testimonials:
${companyData.testimonials?.length > 0
      ? companyData.testimonials.map(t => `- "${t.quote || "No quote available."}" - ${t.name || "Anonymous"}, ${t.company || "Unknown company"}`).join("\n")
      : "No testimonials available."}

### Contact Information:
- **Phone:** ${companyData.contact?.phone || "Not provided"}
- **Email:** ${companyData.contact?.email || "Not provided"}
- **Address:** ${companyData.contact?.hq_address || "Not provided"}
- **Website:** ${companyData.contact?.website || "Not available"}

When answering user questions, be professional, friendly, and informative. If a user asks about a service we do not provide, kindly guide them to relevant available services.
  `.trim();
}

