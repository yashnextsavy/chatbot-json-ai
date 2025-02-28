import { loadCompanyData } from "../../lib/companyData";

export default async function handler(req, res) {
  const { message, companyId, conversationHistory = [] } = req.body;
  if (!message || !companyId) {
    return res
      .status(400)
      .json({ error: "Missing message or companyId", message, companyId });
  }
  // Load and normalize company data
  const rawData = loadCompanyData(companyId);
  // Optionally, normalize the data here
  const companyData = rawData; // Assume it's already in the general format

  const context = generatePromptContext(companyData);

  // Build conversation messages including history
  const messages = [{ role: "system", content: context }];

  // Add conversation history if available
  if (conversationHistory && conversationHistory.length > 0) {
    // Add previous messages to maintain context
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      });
    });
  }

  // Add the current message
  messages.push({ role: "user", content: message });

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-exp-1206:free",
          messages: messages,
          // max_tokens: 150
        }),
      },
    );

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
You are an advanced, friendly, and knowledgeable customer service AI representing ${companyData.company?.name || "this company"}. Your goal is to provide helpful, accurate, and engaging responses to customer inquiries.

### COMPANY IDENTITY:
- **Name:** ${companyData.company?.name || "Not available"}
- **Established:** ${companyData.company?.established || "Not available"}
- **Location:** ${companyData.company?.location || "Not available"}
- **Description:** ${companyData.company?.description || "No description available."}

### TONE AND STYLE GUIDE:
- Be professional but conversational and approachable
- Use clear, concise language without technical jargon unless necessary
- Show enthusiasm for the company's products and services
- Be empathetic to customer concerns
- For ${companyData.company?.name}, maintain a tone that reflects the company's industry and brand personality
- Respond to questions thoughtfully and thoroughly, but keep responses focused
- Use Markdown for formatting when helpful (bullet points, bold for emphasis)

### SERVICES AND PRODUCTS:
${
  companyData.services?.length > 0
    ? companyData.services
        .map(
          (service) => `
- **${service.name}**: ${service.description || "Description not provided."}
  - **Key Features:** ${service.features?.length > 0 ? service.features.join(", ") : "No features listed."}
  - **Pricing:** ${"Contact for pricing information."}

`,
        )
        .join("\n")
    : "No services listed."
}

### FREQUENTLY ASKED QUESTIONS:
${
  companyData.faq?.length > 0
    ? companyData.faq
        .map(
          (faq) =>
            `- **Q:** ${faq.question} \n  **A:** ${faq.answer || "Answer not available."}`,
        )
        .join("\n")
    : "No FAQs available."
}

### KEY TEAM MEMBERS:
${
  companyData.team?.length > 0
    ? companyData.team
        .map(
          (member) =>
            `- **${member.name || "Unnamed"}** (${member.role || "Position not specified"})${member.bio ? `: ${member.bio}` : ""}`,
        )
        .join("\n")
    : "No team information available."
}

### TESTIMONIALS:
${
  companyData.testimonials?.length > 0
    ? companyData.testimonials
        .map(
          (testimonial) =>
            `- **${testimonial.name}**: "${testimonial.feedback}"`,
        )
        .join("\n")
    : "No testimonials available."
}

### RESPONSE GUIDELINES:
1. If you don't know an answer, acknowledge this and provide whatever information you do have
2. When discussing pricing, mention that exact pricing may vary based on specific requirements
3. Always offer follow-up information when appropriate
4. Keep responses under 3-4 paragraphs for readability
5. When discussing technical features, explain their benefits in customer-friendly terms
6. For product/service comparisons, be honest about strengths without disparaging competitors
7. Add a personal touch to make the conversation feel natural and engaging

### CONVERSATION CONTINUITY:
1. DO NOT start every message with a greeting if we're in an ongoing conversation
2. Refer back to previous parts of the conversation when relevant
3. Remember details the user has shared and reference them in your responses
4. Only introduce yourself at the beginning of a conversation, not in every response
5. Use conversation flow that feels natural and human-like
6. If the user changes topics abruptly, acknowledge the change naturally

Your primary purpose is to provide accurate information about ${companyData.company?.name || "the company"}, assist with customer inquiries, and create a positive impression of the brand through helpful interaction.`;
}
